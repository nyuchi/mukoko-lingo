# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nyuchi Lingo is a multilingual language learning platform (English, Shona, Ndebele, Chinese) built with Next.js 16, Supabase, and OpenAI. The app provides phrase learning, AI conversation practice, and admin content management.

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server (localhost:3000)

# Build & Deploy
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
```

### Running with Dev Mode

For local development without Supabase auth:

```bash
# Set environment variable
export NEXT_PUBLIC_DEV_MODE=true
npm run dev

# Alternative: Use browser console
# localStorage.setItem('DEV_MODE', 'true')
# Then refresh page
```

**Important**: Dev mode bypasses ALL authentication and grants admin access. See [DEV_MODE.md](DEV_MODE.md) for details.

## Architecture

### Authentication System

**Dual-Mode Architecture:**
- **Production**: Supabase Auth with server/client separation
  - Server: `lib/supabase/server.ts` (async cookies)
  - Client: `lib/supabase/client.ts` (singleton)
  - Middleware: `middleware.ts` refreshes sessions
- **Development**: Dev mode (`lib/dev-mode.ts`) provides mock admin user (dev@nyuchi.com)

**Flow**: Middleware checks dev mode first → validates Supabase session → redirects unauthenticated users to `/auth/login`

**Key Files**:
- [middleware.ts](middleware.ts) - Route protection
- [lib/supabase/admin.ts](lib/supabase/admin.ts) - `isAdmin()` server-side check
- [lib/hooks/use-admin.ts](lib/hooks/use-admin.ts) - `useAdmin()` client-side hook

### Database Schema

**Core Tables**:
- `profiles` - User profiles with role (user/admin), study tracking, preferences
- `phrases` - 200+ phrases in 4 languages with category-based organization
- `phrase_progress` - Learning status tracking (learning/practiced/mastered)
- `study_sessions` - Daily study session analytics
- `bookmarks` - User-saved phrases
- `ai_conversations` & `ai_messages` - Chat history with moderation flags
- `moderation_alerts` - Flagged content from AI moderation
- `learning_standards` - Proficiency level definitions (beginner → fluent)

**Key Functions**:
- `is_admin()` / `check_is_admin()` - Role checking (handles dev mode UUID)
- `update_study_streak()` - Trigger maintains daily streaks
- `get_user_activity_summary()` - Admin dashboard analytics

**Row Level Security**: All tables have RLS policies. Users access only their own data; admins have elevated access via role checks.

### Component Architecture

**Server vs Client Pattern**:
- **Server Components**: Fetch data server-side using `createClient()` from `lib/supabase/server.ts`, pass as props
- **Client Components**: Marked with `"use client"`, handle interactivity using singleton from `lib/supabase/client.ts`

**Directory Structure**:
- `components/ui/` - Radix UI primitives (shadcn/ui pattern)
- `components/admin/` - Admin feature components
- `components/` - Main feature components

**Large Files to Watch**:
- [components/admin-dashboard.tsx](components/admin-dashboard.tsx) (43KB) - Monolithic admin dashboard

### Layout System (v2.0+)

**Standardized Layout Pattern**: All authenticated pages use responsive layouts with sidebar integration.

**SidebarLayout Component** (`components/sidebar-layout.tsx`):
- Automatically adjusts content margin based on sidebar collapse state
- Desktop expanded: `lg:ml-64` (256px margin)
- Desktop collapsed: `lg:ml-16` (64px margin)
- Mobile: No margin (overlay sidebar)
- Smooth 300ms transition animation

**Usage Pattern**:
```tsx
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarLayout } from "@/components/sidebar-layout"

export function PageClient() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <SidebarLayout>
        <main className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Page content */}
        </main>
      </SidebarLayout>
    </div>
  )
}
```

**AdminLayout Component** (`components/admin/admin-layout.tsx`):
- Wraps all admin pages with consistent layout
- Includes SidebarLayout for responsive margins
- Centered content with `max-w-6xl` constraint
- Professional appearance across all admin sections

**Max-Width Strategy**:
- **Forms/Reading** (`max-w-4xl` / 896px): Profile, text-heavy pages
- **Interactive** (`max-w-5xl` / 1024px): AI Practice, chat interfaces
- **Data/Dashboards** (`max-w-6xl` / 1152px): Analytics, admin pages, tables

**Sidebar State Management**:
- `useSidebar()` hook from `lib/contexts/sidebar-context.tsx`
- Global state persisted to localStorage
- Returns `{ isCollapsed, setIsCollapsed }`
- Safe default when context unavailable

### Navigation System

**AppSidebar** (`components/app-sidebar.tsx`):
- Primary navigation for all authenticated pages
- Collapsible sidebar (desktop): 256px expanded, 64px collapsed
- Overlay sidebar (mobile): Hamburger menu
- Fixed position, full height, blur effect background

**Navigation Sections**:
1. **Main**: Home, Browse Phrases, AI Tutor
2. **Learning**: My Progress, My Bookmarks, Analytics
3. **Account**: Profile Settings
4. **Administration** (admin only): Overview, Users, Phrases, Standards, Moderation, Activity

**Theme & Language Controls**:
- Located in sidebar footer above user menu
- **ThemeSwitcher**: Light/Dark/System theme selection
- **LanguageSwitcher**: English, Shona, Ndebele, Chinese UI
- `useUILanguage()` hook manages language state with localStorage persistence

**AppHeader** (legacy, public pages only):
- Used for unauthenticated pages (landing, about)
- Horizontal navigation bar
- Lighter weight for marketing pages

### Admin System

**Access Control**:
- Server-side: `await isAdmin()` from `lib/supabase/admin.ts`
- Client-side: `useAdmin()` hook checks role in profiles table
- Database-level: RLS policies + `is_admin()` function

**Admin Routes**:
- `/admin/overview` - Statistics dashboard
- `/admin/users` - User management (role updates, suspend/activate)
- `/admin/phrases` - Content CRUD
- `/admin/standards` - Learning standards editor
- `/admin/moderation` - Content moderation queue
- `/admin/activity` - Activity logs and monitoring

**Admin API Routes**:
- `/api/admin/learning-standards` - CRUD for proficiency standards
- `/api/admin/update-role` - Change user roles
- `/api/admin/user-action` - Suspend/activate users
- `/api/admin/moderation/[id]` - Review moderation alerts

All admin API routes use `requireAdmin()` check.

### AI Integration

**Endpoints** (`app/api/ai/`):
- `chat/route.ts` - Streaming chat with Claude Haiku 4.5 (practice/scenario/translation_help)
- `generate-scenario/route.ts` - Generate practice scenarios
- `recommend-phrases/route.ts` - AI-powered phrase recommendations

**AI Features**:
- Vercel AI SDK with Vercel AI Gateway
- Model: `anthropic/claude-haiku-4.5` for all AI operations
- Content moderation via `lib/ai/moderation.ts` using Claude Haiku 4.5
- Moderation checks: sexual, hate, harassment, violence, self-harm, abuse
- Flagged content creates `moderation_alerts` for admin review
- Learning standards guide AI teaching approach based on proficiency
- **Note**: No API keys needed - managed through Vercel AI Gateway

**Flow**: User message → moderation check → Claude Haiku chat → stream response → store in database

## Data Fetching Patterns

### Server-Side (Preferred)
```typescript
// In Server Component (app/page.tsx)
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data } = await supabase.from('phrases').select('*')
return <ClientComponent data={data} />
```

### Client-Side (Interactive)
```typescript
// In Client Component
"use client"
import { createClient } from '@/lib/supabase/client'

const supabase = createClient() // singleton
const { data } = await supabase.from('bookmarks').select('*')
```

### Optimistic Updates
Bookmarks and progress use optimistic UI updates: update local state immediately, sync to database, revert on error.

## Database Migrations

**Location**: `scripts/` directory (27 SQL files numbered 001-027)

**Migration Types**:
- Schema changes (CREATE TABLE, ALTER TABLE)
- Row Level Security policies
- Database functions (PL/pgSQL)
- Database triggers
- Indexes for performance
- Data seeding

**Applying Migrations**:

1. **Create SQL file** in `scripts/` (e.g., `028_your_migration.sql`)
2. **Apply via Supabase Dashboard**:
   - Go to SQL Editor
   - Copy migration file contents
   - Paste and run
   - Verify success
3. **Or use Supabase CLI** (development):
   ```bash
   # Install CLI
   npm install -g supabase

   # Link project
   supabase link --project-ref your-project-ref

   # Apply all migrations
   supabase db push

   # Reset database (DESTRUCTIVE - Dev only!)
   supabase db reset
   ```

**Migration Order**: Critical! Apply in numerical order (001 → 027)

**Recent Migrations**:
- 001-002: Initial phrases and seed data
- 003-004: Profiles and preferences
- 005-007: Bookmarks and favorites
- 008-011: Progress tracking and AI features
- 012-015: AI conversations and moderation
- 016-020: User ID column fixes
- 022-024: Learning standards
- 025: Performance indexes
- 026: User status and partitioning
- 027: Critical RLS policy fixes

## Key Utilities

**Core Libraries**:
- `lib/supabase/` - Database client configurations
- `lib/dev-mode.ts` - Dev mode utilities and mock data
- `lib/ai/moderation.ts` - Content moderation with Claude Haiku 4.5
- `lib/phrases-data.ts` - Phrase type definitions (59KB)
- `lib/translations.ts` - UI translations for 4 languages (16KB)
- `lib/seo-config.ts` - Metadata and structured data

**React Hooks**:
- `lib/hooks/use-admin.ts` - Admin role checking (client-side)
- `lib/hooks/use-ui-language.ts` - UI language state management with localStorage
- `lib/contexts/sidebar-context.tsx` - Sidebar collapse state management with localStorage

## Special Considerations

### Dev Mode Security
**Never enable `NEXT_PUBLIC_DEV_MODE=true` in production.** This completely bypasses authentication and grants admin access to everyone. The mock dev user (UUID: 00000000-0000-0000-0000-000000000000) automatically passes admin checks.

### Build Configuration
- Image optimization disabled (`unoptimized: true`)
- TypeScript/ESLint errors ignored during builds for rapid iteration
- This is intentional for fast prototyping but should be addressed for production

### Technical Debt
- Large monolithic components (especially `admin-dashboard.tsx`)
- No automated testing visible in codebase
- Limited error boundaries
- Some build warnings ignored

### Performance Notes
- Phrases limited to 100-200 per query
- Recent views capped at 20 items
- Analytics computed on-demand (not pre-aggregated)
- Client-side filtering for categories/search

## Common Workflows

### Adding a New App Page (Authenticated)
1. Create page in `app/app/[feature]/page.tsx` (Server Component)
2. Create client component in `components/[feature]-client.tsx`
3. Use standardized layout pattern:
   ```tsx
   "use client"
   import { AppSidebar } from "@/components/app-sidebar"
   import { SidebarLayout } from "@/components/sidebar-layout"
   import { useUILanguage } from "@/lib/hooks/use-ui-language"

   export function FeatureClient() {
     const { uiLanguage } = useUILanguage()

     return (
       <div className="min-h-screen bg-background">
         <AppSidebar />
         <SidebarLayout>
           <main className="container mx-auto px-4 py-12 max-w-6xl">
             {/* Your content */}
           </main>
         </SidebarLayout>
       </div>
     )
   }
   ```
4. Add navigation link to `components/app-sidebar.tsx`
5. Choose appropriate max-width: `max-w-4xl` (forms), `max-w-5xl` (interactive), `max-w-6xl` (data)

### Adding a New Admin Feature
1. Create component in `components/admin/`
2. Add route in `app/admin/[feature]/page.tsx`
3. Use AdminLayout wrapper:
   ```tsx
   import { AdminLayout } from "@/components/admin/admin-layout"

   export default function AdminFeaturePage() {
     return (
       <AdminLayout>
         {/* Your admin content */}
       </AdminLayout>
     )
   }
   ```
4. Create API route in `app/api/admin/` if needed
5. Add `requireAdmin()` check to API route
6. Update admin navigation in `components/app-sidebar.tsx`
7. Create database migration if schema changes needed

### Adding a New Phrase Category
1. Update `phrases` table data via admin UI or SQL
2. Categories are stored as strings, no schema change needed
3. Client-side filtering handles new categories automatically

### Modifying Learning Standards
1. Use admin UI at `/admin/standards`
2. Standards stored in `learning_standards` table
3. Changes affect AI conversation context via API routes
4. Standards define vocabulary complexity and explanation depth

### Working with AI Features
1. All AI endpoints in `app/api/ai/`
2. Add moderation check using `moderateContent()` from `lib/ai/moderation.ts`
3. Use Vercel AI SDK for streaming: `streamText()` from 'ai' package
4. Store conversations in `ai_conversations` and `ai_messages` tables
5. Failed moderation creates `moderation_alerts` for admin review

## Testing Locally

1. Enable dev mode (see Dev Mode section above)
2. Access admin at `http://localhost:3000/admin`
3. Test AI features at `/app/ai-practice`
4. Check moderation queue at `/admin/moderation`
5. Test sidebar collapse/expand functionality
6. Test theme switching (light/dark/system)
7. Test language switching (4 languages)

Mock admin user (dev@nyuchi.com) has full access to all features.

---

## Related Documentation

### Core Documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for Vercel and Supabase
- **[SECURITY.md](SECURITY.md)** - Security architecture, RLS policies, authentication
- **[CHANGELOG.md](CHANGELOG.md)** - Complete version history and release notes
- **[RELEASES.md](RELEASES.md)** - Release management and versioning guidelines
- **[DEV_MODE.md](DEV_MODE.md)** - Development mode setup and security warnings

### Feature Documentation
- **[BRANDING.md](BRANDING.md)** - Brand guidelines, colors, typography, UI patterns
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Component library and design patterns

### Migration Documentation
- **[SIDEBAR_LAYOUT_MIGRATION_COMPLETE.md](SIDEBAR_LAYOUT_MIGRATION_COMPLETE.md)** - v2.0 layout system implementation
- **[UNIFIED_LAYOUT_COMPLETE.md](UNIFIED_LAYOUT_COMPLETE.md)** - Unified layout across all pages
- **[APP_HEADER_TO_SIDEBAR_MIGRATION.md](APP_HEADER_TO_SIDEBAR_MIGRATION.md)** - Migration from AppHeader to AppSidebar
- **[THEME_AND_LANGUAGE_CONTROLS_ADDED.md](THEME_AND_LANGUAGE_CONTROLS_ADDED.md)** - Theme and language switcher integration
- **[CENTERED_LAYOUT_APPLIED.md](CENTERED_LAYOUT_APPLIED.md)** - Centered layout implementation

### Technical Fixes
- **[FIXES_SUMMARY.md](FIXES_SUMMARY.md)** - Summary of major fixes and improvements
- **[NAVIGATION_FIX_SUMMARY.md](NAVIGATION_FIX_SUMMARY.md)** - Navigation system improvements
- **[MOBILE_USABILITY_FIXES.md](MOBILE_USABILITY_FIXES.md)** - Mobile responsiveness fixes

---

## Project Status

**Current Version**: 2.0.0 (November 10, 2025)
**Framework**: Next.js 16, React 19, Supabase, Vercel
**Status**: Production-ready with continuous deployment
**Development Mode**: Active (localhost:3000)
