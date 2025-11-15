export type UserRole = 'super_admin' | 'admin' | 'client_user';

export type PlanType = 'trial' | 'starter' | 'professional' | 'enterprise' | 'unlimited';

export type OrganizationStatus = 'trial' | 'active' | 'suspended' | 'cancelled';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanType;
  quota_minutes: number;
  used_minutes: number;
  status: OrganizationStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserRoleData {
  id: string;
  user_id: string;
  organization_id: string | null;
  role: UserRole;
  permissions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface ApiKey {
  id: string;
  user_id: string;
  organization_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  scope: string[];
  rate_limit: number;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyUsage {
  id: string;
  api_key_id: string;
  endpoint: string;
  method: string;
  status_code: number | null;
  response_time_ms: number | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface UserPermission {
  id: string;
  user_role_id: string;
  resource: string;
  actions: string[];
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: UserRoleData;
  permissions: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, organizationName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (resource: string, action?: string) => boolean;
  isRole: (role: UserRole) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isClientUser: boolean;
}

export interface FeatureAccess {
  canViewDashboard: boolean;
  canManageModels: boolean;
  canManageDatasets: boolean;
  canRunWorkflows: boolean;
  canViewWorkflowHistory: boolean;
  canManageUsers: boolean;
  canManageOrganization: boolean;
  canViewBilling: boolean;
  canManageApiKeys: boolean;
  canViewSystemHealth: boolean;
  canViewAuditLogs: boolean;
  canAccessTraining: boolean;
  canAccessCompliance: boolean;
  canManageProviders: boolean;
  canConfigureRouting: boolean;
}
