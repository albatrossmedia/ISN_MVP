/*
  # Create RBAC and Organizations Schema

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text, organization name)
      - `slug` (text, unique identifier)
      - `plan` (text, subscription plan)
      - `quota_minutes` (integer, monthly quota)
      - `used_minutes` (integer, current usage)
      - `status` (text, active/suspended/trial)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `organization_id` (uuid, references organizations)
      - `role` (text, super_admin/admin/client_user)
      - `permissions` (jsonb, feature permissions)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `api_keys`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `organization_id` (uuid, references organizations)
      - `name` (text, key identifier)
      - `key_prefix` (text, visible prefix like sk_live_)
      - `key_hash` (text, hashed full key)
      - `scope` (text[], permissions array)
      - `rate_limit` (integer, requests per hour)
      - `last_used_at` (timestamp)
      - `expires_at` (timestamp)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `api_key_usage`
      - `id` (uuid, primary key)
      - `api_key_id` (uuid, references api_keys)
      - `endpoint` (text, API endpoint called)
      - `method` (text, HTTP method)
      - `status_code` (integer)
      - `response_time_ms` (integer)
      - `created_at` (timestamp)

    - `user_permissions`
      - `id` (uuid, primary key)
      - `user_role_id` (uuid, references user_roles)
      - `resource` (text, feature/resource name)
      - `actions` (text[], read/write/delete actions)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for super_admin, admin, and client_user roles
    - Ensure data isolation between organizations
    - Secure API key storage with hashing
*/

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'trial',
  quota_minutes integer NOT NULL DEFAULT 100,
  used_minutes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'trial',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'client_user',
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, organization_id)
);

-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_prefix text NOT NULL,
  key_hash text NOT NULL,
  scope text[] DEFAULT ARRAY['read']::text[],
  rate_limit integer NOT NULL DEFAULT 1000,
  last_used_at timestamptz,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create api_key_usage table
CREATE TABLE IF NOT EXISTS api_key_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_id uuid NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  method text NOT NULL DEFAULT 'GET',
  status_code integer,
  response_time_ms integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_role_id uuid NOT NULL REFERENCES user_roles(id) ON DELETE CASCADE,
  resource text NOT NULL,
  actions text[] NOT NULL DEFAULT ARRAY['read']::text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_role_id, resource)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_org_id ON user_roles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_org_id ON api_keys(organization_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON api_key_usage(created_at);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations

-- Super admins can view all organizations
CREATE POLICY "Super admins can view all organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  );

-- Users can view their own organization
CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = organizations.id
      AND user_roles.is_active = true
    )
  );

-- Super admins can insert organizations
CREATE POLICY "Super admins can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  );

-- Super admins can update organizations
CREATE POLICY "Super admins can update organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  );

-- RLS Policies for user_roles

-- Users can view their own role
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Super admins and admins can view all roles in their org
CREATE POLICY "Admins can view organization roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles AS ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = user_roles.organization_id
      AND ur.role IN ('super_admin', 'admin')
      AND ur.is_active = true
    )
  );

-- Super admins can insert user roles
CREATE POLICY "Super admins can create user roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles AS ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
      AND ur.is_active = true
    )
  );

-- Admins can insert roles in their org (except super_admin)
CREATE POLICY "Admins can create roles in their organization"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    role != 'super_admin' AND
    EXISTS (
      SELECT 1 FROM user_roles AS ur
      WHERE ur.user_id = auth.uid()
      AND ur.organization_id = user_roles.organization_id
      AND ur.role = 'admin'
      AND ur.is_active = true
    )
  );

-- Super admins can update user roles
CREATE POLICY "Super admins can update user roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles AS ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles AS ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
      AND ur.is_active = true
    )
  );

-- RLS Policies for api_keys

-- Users can view their own API keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all API keys in their org
CREATE POLICY "Admins can view organization API keys"
  ON api_keys FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = api_keys.organization_id
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- Users can create their own API keys
CREATE POLICY "Users can create their own API keys"
  ON api_keys FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.organization_id = api_keys.organization_id
      AND user_roles.is_active = true
    )
  );

-- Users can update their own API keys
CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own API keys
CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for api_key_usage

-- Users can view usage of their own API keys
CREATE POLICY "Users can view their own API key usage"
  ON api_key_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      WHERE api_keys.id = api_key_usage.api_key_id
      AND api_keys.user_id = auth.uid()
    )
  );

-- Admins can view all API key usage in their org
CREATE POLICY "Admins can view organization API key usage"
  ON api_key_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM api_keys
      JOIN user_roles ON user_roles.organization_id = api_keys.organization_id
      WHERE api_keys.id = api_key_usage.api_key_id
      AND user_roles.user_id = auth.uid()
      AND user_roles.role IN ('super_admin', 'admin')
      AND user_roles.is_active = true
    )
  );

-- System can insert usage records (this would typically be done via service role)
CREATE POLICY "Service can insert API key usage"
  ON api_key_usage FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for user_permissions

-- Users can view their own permissions
CREATE POLICY "Users can view their own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = user_permissions.user_role_id
      AND user_roles.user_id = auth.uid()
    )
  );

-- Admins can view all permissions in their org
CREATE POLICY "Admins can view organization permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles AS ur1
      JOIN user_roles AS ur2 ON ur2.organization_id = ur1.organization_id
      WHERE ur2.id = user_permissions.user_role_id
      AND ur1.user_id = auth.uid()
      AND ur1.role IN ('super_admin', 'admin')
      AND ur1.is_active = true
    )
  );

-- Super admins can manage permissions
CREATE POLICY "Super admins can manage permissions"
  ON user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'super_admin'
      AND user_roles.is_active = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default super admin organization
INSERT INTO organizations (name, slug, plan, quota_minutes, status)
VALUES ('System Admin', 'system-admin', 'unlimited', 999999, 'active')
ON CONFLICT (slug) DO NOTHING;
