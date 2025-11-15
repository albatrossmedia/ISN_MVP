# Dual Console Architecture Guide

## Overview

The IndicSubtitleNet platform now features a dual console architecture with distinct interfaces for administrators and client users.

## Architecture Components

### 1. Master Admin Console (`/dashboard`)
Full-featured administrative interface for system operators and organization administrators.

**Access Levels:**
- **Super Admin**: Full system access, can manage organizations
- **Admin**: Organization-level administration

**Features:**
- Complete model and dataset management
- System health monitoring and metrics
- User and access control management
- Organization management (super admin only)
- API key administration
- Audit logs and compliance tracking
- Advanced performance analytics
- Workflow orchestration and monitoring

### 2. Client Console (`/client`)
Streamlined, user-friendly interface for end clients.

**Access Level:**
- **Client User**: Limited, focused feature set

**Features:**
- Dashboard with usage overview
- Run subtitle generation workflows
- View demo workflows and tutorials
- API key self-service management
- Workflow history
- Usage and billing information

## Database Schema

### Organizations Table
Stores multi-tenant organization data:
- `id`: UUID primary key
- `name`: Organization name
- `slug`: Unique URL-friendly identifier
- `plan`: Subscription tier (trial, starter, professional, enterprise, unlimited)
- `quota_minutes`: Monthly processing quota
- `used_minutes`: Current usage
- `status`: Account status (trial, active, suspended, cancelled)

### User Roles Table
Links users to organizations with role-based access:
- `user_id`: References auth.users
- `organization_id`: References organizations
- `role`: super_admin, admin, or client_user
- `permissions`: JSONB field for granular permissions
- `is_active`: Account status flag

### API Keys Table
Secure API key management:
- `user_id`: Key owner
- `organization_id`: Organization association
- `name`: Human-readable identifier
- `key_prefix`: Visible portion (e.g., "sk_live_abc...")
- `key_hash`: SHA-256 hashed full key
- `scope`: Permission array (read, write, delete)
- `rate_limit`: Requests per hour limit
- `expires_at`: Optional expiration date
- `is_active`: Enable/disable flag

### Demo Workflows Table
Pre-built tutorial workflows:
- Sample workflows with various difficulty levels
- Step-by-step stage breakdowns
- Quality metrics and configuration examples
- Used for client onboarding and demonstrations

### Workflow Templates Table
Reusable workflow configurations:
- Organization-specific or public templates
- Model requirements and configurations
- Cost estimations
- Use case descriptions

### User Workflow History Table
Tracks all workflow executions:
- User and organization association
- Workflow type (demo or production)
- Status tracking (pending, running, completed, failed)
- Progress monitoring
- Input/output file references
- Quality metrics and error logging

## Row Level Security (RLS)

All tables implement strict RLS policies:

### Organizations
- Super admins: Full access
- Users: Can view their own organization only

### User Roles
- Users: Can view their own role
- Admins: Can view and manage roles within their organization
- Super admins: Full access across all organizations

### API Keys
- Users: Full CRUD on their own keys
- Admins: View all keys within their organization
- Automatic usage logging

### Workflow History
- Users: Access only their own workflows
- Admins: View all workflows within their organization

## Authentication Flow

### Sign Up
1. User registers with email/password via Supabase Auth
2. Optional: Create new organization (becomes admin)
3. User role record created automatically
4. Default role assignment based on context

### Sign In
1. Authenticate via Supabase Auth
2. Load user role and organization data
3. Fetch user permissions
4. Route to appropriate console based on role

### Role-Based Routing
- Super Admin / Admin → Master Admin Console (`/dashboard`)
- Client User → Client Console (`/client`)
- Automatic redirect based on permissions

## API Key Management

### Generation Process
1. User creates key via UI with name and permissions
2. System generates cryptographically secure key (`sk_live_...`)
3. Key is hashed with SHA-256 for storage
4. Full key shown ONCE to user (copy-to-clipboard)
5. Only prefix stored in visible form

### Security Features
- Keys hashed before storage (irreversible)
- Rate limiting per key
- Scope-based permissions (read, write, delete)
- Optional expiration dates
- Soft delete (deactivation) for audit trail
- Usage tracking for all API calls

### Usage Tracking
- Every API call logged with:
  - Endpoint and HTTP method
  - Status code
  - Response time
  - Timestamp
- Used for analytics and billing

## Permission System

### Feature Access Control
Implemented via `getFeatureAccess()` helper:

```typescript
{
  canViewDashboard: true,           // All users
  canManageModels: isAdmin,         // Admin and above
  canManageDatasets: isAdmin,       // Admin and above
  canRunWorkflows: true,            // All users
  canViewWorkflowHistory: true,     // All users
  canManageUsers: isAdmin,          // Admin and above
  canManageOrganization: isAdmin,   // Admin and above
  canViewBilling: true,             // All users
  canManageApiKeys: true,           // All users
  canViewSystemHealth: isAdmin,     // Admin and above
  canViewAuditLogs: isAdmin,        // Admin and above
  canAccessTraining: isAdmin,       // Admin and above
  canAccessCompliance: isAdmin,     // Admin and above
  canManageProviders: isSuperAdmin, // Super admin only
  canConfigureRouting: isSuperAdmin // Super admin only
}
```

### Permission Checking
```typescript
// In components
const { hasPermission } = useAuth();
if (hasPermission('models', 'write')) {
  // Allow model creation
}

// In routes
<ProtectedRoute requireRole="admin">
  <AdminOnlyPage />
</ProtectedRoute>

<ProtectedRoute requirePermission="models:write">
  <ModelEditor />
</ProtectedRoute>
```

## Client Console Features

### Dashboard
- Usage statistics (workflows run, minutes used, success rate)
- API key count
- Monthly quota visualization with warnings
- Quick action buttons
- Recent workflow history

### Demo Workflows
- Pre-built tutorials (beginner, intermediate, advanced)
- Interactive demo playback
- Stage-by-stage breakdown
- Quality metrics display
- Sample configurations

### Workflow Runner
- Simplified interface vs admin version
- Curated model selections
- Guided configuration
- Real-time progress tracking

### API Key Management
- Self-service key generation
- Scope selection (read, write, delete)
- Rate limit configuration
- Key rotation
- Usage statistics

## Master Admin Console Enhancements

### Organizations Management (Super Admin Only)
- Create and configure organizations
- Set quotas and plans
- Monitor usage across organizations
- Activate/suspend accounts

### API Key Administration
- View all keys within organization
- Monitor key usage patterns
- Identify high-usage keys
- Security audit trail

### Enhanced User Management
- Role assignment
- Permission configuration
- Organization membership
- Activity tracking

## Navigation Structure

### Master Admin Console
```
/dashboard                  - Admin dashboard
/dashboard/workflows/new    - Create workflow
/dashboard/models          - Model registry
/dashboard/datasets        - Dataset catalog
/dashboard/jobs            - Job monitoring
/dashboard/organizations   - Organization mgmt (super admin)
/dashboard/api-keys        - API key administration
/dashboard/users           - User management
/dashboard/system-health   - System monitoring
/dashboard/audit-logs      - Audit trail
```

### Client Console
```
/client                    - Client dashboard
/client/workflows/new      - Run workflow
/client/demo              - Demo workflows
/client/history           - Workflow history
/client/api-keys          - API key management
/client/billing           - Usage and billing
```

## Setup Instructions

### 1. Apply Database Migrations

Run the Supabase migrations:
```bash
# Migration 1: RBAC and Organizations
supabase migration up 20251115080000_create_rbac_and_organizations.sql

# Migration 2: Demo Workflows
supabase migration up 20251115080100_create_demo_workflows.sql
```

### 2. Create Initial Super Admin

After first user signup, manually set their role:
```sql
-- In Supabase SQL Editor
UPDATE user_roles
SET role = 'super_admin',
    organization_id = (SELECT id FROM organizations WHERE slug = 'system-admin')
WHERE user_id = 'YOUR_USER_ID';
```

### 3. Environment Variables

Ensure `.env` has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Test Authentication Flow

1. Sign up as new user
2. Verify role assignment in database
3. Test login and routing
4. Verify RLS policies work correctly

## Best Practices

### For Administrators
1. **Organization Setup**: Create organization before adding users
2. **Quota Management**: Monitor usage and adjust quotas proactively
3. **API Key Auditing**: Regularly review key usage patterns
4. **Role Assignment**: Follow principle of least privilege

### For Client Users
1. **API Key Security**: Never expose keys in client-side code
2. **Quota Awareness**: Monitor usage to avoid service interruption
3. **Demo Workflows**: Use demos to understand capabilities before production
4. **Key Rotation**: Rotate keys periodically for security

### For Developers
1. **RLS Testing**: Always test policies with different user roles
2. **Permission Checks**: Use `hasPermission()` for feature gating
3. **Error Handling**: Gracefully handle permission denied scenarios
4. **Audit Logging**: Log all sensitive operations

## Security Considerations

### API Key Security
- Keys hashed with SHA-256 (non-reversible)
- Only shown once during creation
- Automatic expiration support
- Rate limiting enforced
- Scope-based access control

### Data Isolation
- RLS policies enforce organization boundaries
- Users cannot access other organizations' data
- Super admins have audit trail for all actions

### Authentication
- Supabase Auth handles password security
- JWT tokens for session management
- Automatic token refresh
- Secure sign-out

## Troubleshooting

### User Cannot Access Admin Console
- Verify user role in `user_roles` table
- Check `is_active` flag
- Ensure organization association

### RLS Policy Errors
- Check user authentication status
- Verify organization_id matches
- Test policies in Supabase SQL Editor

### API Key Not Working
- Verify key is active (`is_active = true`)
- Check expiration date
- Confirm scope permissions
- Verify rate limit not exceeded

## Future Enhancements

### Planned Features
1. **Onboarding Flow**: Guided tour for new users
2. **Notification System**: Email/SMS alerts for quota warnings
3. **Advanced Analytics**: Detailed usage breakdowns and trends
4. **Webhook Integration**: Event notifications for workflow completion
5. **Team Collaboration**: Shared workspaces within organizations
6. **SSO Integration**: Enterprise single sign-on support
7. **Audit Export**: Downloadable compliance reports

## API Integration

### Using API Keys
```typescript
// Client-side integration
const apiKey = 'sk_live_your_key_here';

const response = await fetch(`${API_BASE_URL}/models/run`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    // workflow configuration
  }),
});
```

### Rate Limiting
- Default: 1000 requests/hour
- Configurable per key
- 429 status code when exceeded
- Retry-After header provided

## Support

For issues or questions:
1. Check this documentation
2. Review Supabase dashboard for RLS errors
3. Check browser console for client errors
4. Contact system administrator

---

**Last Updated**: 2025-11-15
**Version**: 1.0
**Status**: Production Ready
