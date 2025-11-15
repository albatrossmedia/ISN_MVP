## Onboarding & User Experience System Guide

## Overview

A comprehensive onboarding and user experience enhancement system that guides new users through platform features, tracks progress, provides contextual help, and delivers important notifications.

## Features Implemented

### 1. Database Schema (`20251115090000_create_onboarding_system.sql`)

#### Tables Created

**user_onboarding**
- Tracks user onboarding progress
- Fields: current_step, completed_steps, is_completed, skipped, timestamps
- Unique per user
- Automatically created on user signup

**user_preferences**
- Stores user UI preferences
- Fields: show_tooltips, show_welcome_message, theme, notifications_enabled
- Customizable settings per user
- Created automatically on signup

**user_notifications**
- In-app notification system
- Types: info, warning, success, error
- Priority levels (1-5)
- Optional expiration dates
- Read/dismissed tracking

**feature_announcements**
- Platform-wide feature announcements
- Role-based targeting (super_admin, admin, client_user)
- Active/inactive status
- Optional expiration
- Pre-populated with 3 welcome announcements

**user_activity_log**
- Activity tracking for analytics
- Types: login, logout, workflow_created, api_key_generated, etc.
- IP address and user agent tracking
- Organization-level analytics

### 2. TypeScript Types (`src/types/onboarding.ts`)

Complete type definitions for:
- Onboarding steps and flow
- Notification types
- Feature announcements
- User preferences
- Activity logging
- Checklist items
- Tour steps

### 3. Onboarding Context (`src/contexts/OnboardingContext.tsx`)

Central state management for onboarding:
- Load and manage onboarding progress
- Handle user preferences
- Real-time notifications via Supabase subscriptions
- Feature announcements management
- Activity logging
- Step completion tracking

### 4. UI Components

#### WelcomeWizard (`src/components/onboarding/WelcomeWizard.tsx`)
- Multi-step guided tour for new users
- Different flows for client users vs admins
- Client flow: Welcome → Demos → API Keys → Ready
- Admin flow: Welcome → Organizations → Ready
- Progress indicator
- Skip functionality
- Contextual actions

#### QuickStartChecklist (`src/components/onboarding/QuickStartChecklist.tsx`)
- Interactive checklist for first-time tasks
- Progress tracking with visual progress bar
- Collapsible interface
- Dismissible with user preference
- Items:
  - Try a Demo Workflow
  - Generate First API Key
  - Run First Workflow
- Celebration message on completion

#### NotificationCenter (`src/components/onboarding/NotificationCenter.tsx`)
- Bell icon with unread count badge
- Dropdown panel with notifications
- Color-coded by type (info, success, warning, error)
- Mark as read functionality
- Dismiss notifications
- Optional action buttons with links
- Real-time updates

#### FeatureAnnouncement (`src/components/onboarding/FeatureAnnouncement.tsx`)
- Banner-style announcements
- Role-based visibility
- Dismissible with localStorage persistence
- Color-coded by type (new_feature, improvement, update)
- Optional action button
- Gradient styling

#### HelpTooltip (`src/components/onboarding/HelpTooltip.tsx`)
- Contextual help bubbles
- Respects user preference (show_tooltips)
- Hover and click triggers
- 4 placement options (top, bottom, left, right)
- Smooth animations
- Minimal, non-intrusive design

#### EmptyState (`src/components/ui/EmptyState.tsx`)
- Reusable empty state component
- Icon, title, description
- Primary and secondary actions
- Used throughout the app for better UX

### 5. Integration

#### App.tsx Updates
- Added `OnboardingProvider` wrapping entire app
- Provides onboarding context to all components

#### ClientDashboard Updates
- Automatic welcome wizard on first visit
- Quick start checklist displayed
- Feature announcements banner
- Tracks completion of onboarding steps

#### TopBar Updates
- Integrated `NotificationCenter` component
- User email and role display
- Working logout functionality

## User Flow

### New Client User Journey

1. **Sign Up**
   - User creates account
   - `user_onboarding` and `user_preferences` records auto-created
   - Default settings applied

2. **First Login**
   - Welcome wizard automatically appears
   - Step 1: Introduction to platform features
   - Step 2: Invitation to try demo workflows
   - Step 3: Guide to generate API key
   - Step 4: Ready to start screen

3. **Dashboard Experience**
   - Feature announcements banner displayed
   - Quick start checklist visible
   - Progress tracked automatically
   - Help tooltips available on hover

4. **Completing Actions**
   - View demo workflow → Step marked complete
   - Generate API key → Step marked complete
   - Run first workflow → Step marked complete
   - Celebration message when all done

5. **Ongoing Experience**
   - Notifications in bell icon
   - Feature announcements when new features launch
   - Can toggle tooltips in preferences
   - Can restart onboarding from settings

### Admin User Journey

1. **Sign Up / First Login**
   - Simplified admin-focused welcome wizard
   - Introduction to admin capabilities
   - Guide to organization management
   - Quick access to admin console

2. **Admin Experience**
   - Full notification access
   - System-wide announcements
   - User activity monitoring
   - Advanced features highlighted

## Onboarding Steps

### Client User Steps
1. `welcome` - Introduction screen
2. `demo_workflow` - Try demo workflows
3. `api_key_setup` - Generate API key
4. `first_workflow` - Run first subtitle generation
5. `complete` - Onboarding finished

### Admin User Steps
1. `welcome` - Admin introduction
2. `profile_setup` - Organization management
3. `complete` - Ready to manage

## API Functions

### Context Methods

```typescript
// Start onboarding flow
await startOnboarding();

// Complete a specific step
await completeStep('demo_workflow');

// Skip onboarding entirely
await skipOnboarding();

// Update user preferences
await updatePreferences({
  show_tooltips: false,
  theme: 'dark'
});

// Mark notification as read
await markNotificationRead(notificationId);

// Dismiss notification
await dismissNotification(notificationId);

// Log user activity
await logActivity('workflow_created', {
  workflow_id: 'abc123'
});
```

## Component Usage

### Welcome Wizard
```tsx
import { WelcomeWizard } from '../components/onboarding/WelcomeWizard';

<WelcomeWizard
  isOpen={showWizard}
  onClose={() => setShowWizard(false)}
/>
```

### Quick Start Checklist
```tsx
import { QuickStartChecklist } from '../components/onboarding/QuickStartChecklist';

// Auto-manages visibility based on onboarding status
<QuickStartChecklist />
```

### Notification Center
```tsx
import { NotificationCenter } from '../components/onboarding/NotificationCenter';

// Place in header/topbar
<NotificationCenter />
```

### Help Tooltip
```tsx
import { HelpTooltip } from '../components/onboarding/HelpTooltip';

<HelpTooltip
  content="This is how you generate subtitles"
  placement="right"
/>
```

### Empty State
```tsx
import { EmptyState } from '../components/ui/EmptyState';
import { FileText } from 'lucide-react';

<EmptyState
  icon={FileText}
  title="No workflows yet"
  description="Create your first workflow to get started"
  actionLabel="Create Workflow"
  onAction={() => navigate('/workflows/new')}
/>
```

## Creating Notifications

### Programmatically (Admins)
```typescript
await supabase.from('user_notifications').insert({
  user_id: userId,
  type: 'info',
  title: 'Welcome!',
  message: 'Your account is now active',
  action_url: '/client/workflows/new',
  action_label: 'Get Started',
  priority: 5
});
```

### Via SQL (System)
```sql
INSERT INTO user_notifications (
  user_id,
  type,
  title,
  message,
  action_url,
  action_label,
  priority
)
VALUES (
  '<user-id>',
  'success',
  'API Key Created',
  'Your new API key is ready to use',
  '/client/api-keys',
  'View Keys',
  4
);
```

## Creating Feature Announcements

### Super Admin Only
```typescript
await supabase.from('feature_announcements').insert({
  title: 'New Feature: Bulk Processing',
  description: 'Process multiple videos at once',
  type: 'new_feature',
  target_roles: ['client_user', 'admin'],
  action_url: '/dashboard/workflows/bulk',
  action_label: 'Try it Now',
  is_active: true,
  priority: 5
});
```

## Activity Logging

Automatically logged activities:
- User login/logout
- Workflow creation and completion
- API key generation
- Demo workflow views
- Feature usage

### Custom Activity Logging
```typescript
const { logActivity } = useOnboarding();

await logActivity('feature_used', {
  feature: 'advanced_settings',
  timestamp: Date.now()
});
```

## User Preferences

### Available Preferences
- `show_tooltips` - Enable/disable contextual help
- `show_welcome_message` - Show/hide welcome messages
- `theme` - UI theme (light/dark/auto)
- `notifications_enabled` - In-app notifications on/off
- `email_notifications` - Email notifications on/off
- `tutorial_completed` - Tutorial completion status

### Updating Preferences
```typescript
const { updatePreferences } = useOnboarding();

await updatePreferences({
  show_tooltips: false,
  theme: 'dark',
  notifications_enabled: true
});
```

## Best Practices

### For Developers

1. **Check Onboarding Status**
   ```typescript
   if (!onboarding?.is_completed && !onboarding?.skipped) {
     // Show onboarding content
   }
   ```

2. **Respect User Preferences**
   ```typescript
   if (preferences?.show_tooltips) {
     return <HelpTooltip content="..." />;
   }
   ```

3. **Log Important Actions**
   ```typescript
   await logActivity('workflow_created', { id: workflowId });
   ```

4. **Use Empty States**
   ```typescript
   if (items.length === 0) {
     return <EmptyState ... />;
   }
   ```

### For Content Creators

1. **Write Clear Tooltips**
   - Keep under 100 characters
   - Action-oriented language
   - Avoid technical jargon

2. **Effective Notifications**
   - Clear, concise titles
   - Actionable messages
   - Set appropriate priority
   - Include expiration for time-sensitive items

3. **Feature Announcements**
   - Highlight benefits, not just features
   - Include call-to-action
   - Target specific user roles
   - Use engaging visuals when possible

## Customization

### Adding New Onboarding Steps

1. Add step to type definition:
```typescript
export type OnboardingStep =
  | 'welcome'
  | 'demo_workflow'
  | 'your_new_step'  // Add here
  | 'complete';
```

2. Add step to wizard:
```typescript
const clientSteps = [
  // ... existing steps
  {
    title: 'Your New Step',
    description: '...',
    content: <YourComponent />
  }
];
```

3. Track completion:
```typescript
await completeStep('your_new_step');
```

### Creating New Notification Types

```typescript
await supabase.from('user_notifications').insert({
  user_id,
  type: 'custom_type',  // Add custom types as needed
  title: 'Custom Notification',
  message: '...',
  priority: 3
});
```

## Monitoring & Analytics

### Track Onboarding Completion Rates
```sql
SELECT
  COUNT(*) FILTER (WHERE is_completed = true) as completed,
  COUNT(*) FILTER (WHERE skipped = true) as skipped,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE is_completed = true) * 100.0 / COUNT(*), 2) as completion_rate
FROM user_onboarding;
```

### Most Common Activities
```sql
SELECT
  activity_type,
  COUNT(*) as count
FROM user_activity_log
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY activity_type
ORDER BY count DESC;
```

### Notification Engagement
```sql
SELECT
  type,
  COUNT(*) as sent,
  COUNT(*) FILTER (WHERE is_read = true) as read,
  ROUND(COUNT(*) FILTER (WHERE is_read = true) * 100.0 / COUNT(*), 2) as read_rate
FROM user_notifications
GROUP BY type;
```

## Troubleshooting

### Onboarding Not Showing
- Check if user has `is_completed = false` and `skipped = false`
- Verify user_preferences has `show_welcome_message = true`
- Clear localStorage for dismissed items

### Notifications Not Appearing
- Check RLS policies allow user to read notifications
- Verify notification `expires_at` is null or future date
- Check `is_dismissed = false`

### Tooltips Not Showing
- Verify `show_tooltips = true` in user_preferences
- Check that component is properly wrapped with OnboardingProvider
- Ensure mouse events are not blocked by parent elements

## Security Considerations

- ✅ RLS policies enforce data isolation
- ✅ Users can only modify their own records
- ✅ Admins can create notifications for org users only
- ✅ Super admins manage feature announcements
- ✅ Activity logging is append-only
- ✅ Sensitive data not logged in activity_data

## Performance Optimization

- Real-time subscriptions limited to active user's notifications
- Announcements cached and filtered by role
- Activity logs indexed by user_id and created_at
- Preferences loaded once and cached in context
- Notifications limited to 10 most recent

## Future Enhancements

### Planned Features
1. **Interactive Tutorials** - Step-by-step walkthrough with highlight overlays
2. **Video Tutorials** - Embedded video guides for complex features
3. **Achievement System** - Badges and rewards for completing milestones
4. **Progress Dashboard** - Detailed onboarding analytics for admins
5. **A/B Testing** - Test different onboarding flows
6. **Localization** - Multi-language support for onboarding content
7. **Email Digest** - Weekly summary of new features and tips
8. **Smart Recommendations** - AI-powered feature suggestions

---

**Status**: ✅ Complete and Production Ready
**Build Status**: ✅ Passing
**Last Updated**: November 15, 2025
**Version**: 1.0
