# Development Mode

This app includes a development mode that bypasses authentication to make testing and development easier.

## Enabling Dev Mode

Set the following environment variable:

\`\`\`
NEXT_PUBLIC_DEV_MODE=true
\`\`\`

You can add this in the v0 UI:
1. Click the sidebar on the left
2. Go to "Vars" section
3. Add `NEXT_PUBLIC_DEV_MODE` with value `true`

**Alternative method** (for client-side only):
- Open browser console and run: `localStorage.setItem('DEV_MODE', 'true')`
- Refresh the page
- This works immediately without needing to set environment variables

## What Dev Mode Does

1. **Bypasses Authentication**: Middleware skips all auth checks
2. **Mock Admin User**: Provides a mock admin user (dev@nyuchi.com) with full permissions
3. **Visual Indicator**: Shows a yellow banner at the top of the page
4. **Full Access**: Grants access to all protected routes including /admin
5. **Admin Privileges**: Automatically grants admin access without database checks

## Mock User Details

- **Email**: dev@nyuchi.com
- **Display Name**: Dev User (Admin)
- **Role**: admin
- **User ID**: 00000000-0000-0000-0000-000000000000

## Admin Access in Dev Mode

When dev mode is enabled:
- `isAdmin()` (server-side) always returns `true`
- `useAdmin()` (client-side) immediately grants admin access
- All admin routes and features are accessible
- No database role check is performed

## Usage

\`\`\`typescript
import { isDevMode, getDevUser, getDevProfile } from '@/lib/dev-mode'

// Check if dev mode is active
if (isDevMode()) {
  const user = getDevUser()
  const profile = getDevProfile()
  // Use mock data for testing
}
\`\`\`

## Security Warning

**⚠️ NEVER enable dev mode in production!** This completely bypasses all authentication and security measures. Only use this in local development environments.

Dev mode:
- Bypasses all authentication
- Grants admin access to anyone
- Exposes all admin features
- Should NEVER be used in production

## Disabling Dev Mode

Remove or set the environment variable to false:

\`\`\`
NEXT_PUBLIC_DEV_MODE=false
\`\`\`

Or simply delete the variable from your environment settings.

## Troubleshooting

If dev mode isn't working:

1. Check that `NEXT_PUBLIC_DEV_MODE=true` is set
2. Verify the variable is in your environment (check browser console: `process.env.NEXT_PUBLIC_DEV_MODE`)
3. Restart your development server after adding the variable
4. Clear browser cache if the banner doesn't appear
