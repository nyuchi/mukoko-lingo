import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isAdmin, getAdminStats, getUserActivitySummary } from "@/lib/supabase/admin"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata = {
  title: "Admin Dashboard - Nyuchi Lingo",
  description: "Manage users, phrases, and view analytics",
}

export default async function AdminPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const admin = await isAdmin()
  if (!admin) {
    redirect("/")
  }

  // Fetch admin statistics
  const stats = await getAdminStats()
  const userActivity = await getUserActivitySummary()

  // Fetch all phrases for management
  const { data: phrases } = await supabase
    .from("phrases")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  const { data: recentViews } = await supabase
    .from("phrase_views")
    .select(`
      *,
      phrases(english, shona, ndebele, chinese)
    `)
    .order("viewed_at", { ascending: false })
    .limit(20)

  // Fetch user profiles for the recent views
  const userIds = recentViews?.map((v) => v.user_id).filter(Boolean) || []
  const { data: profiles } =
    userIds.length > 0
      ? await supabase.from("profiles").select("user_id, display_name, email").in("user_id", userIds)
      : { data: [] }

  // Merge profiles into recent views
  const recentViewsWithProfiles = recentViews?.map((view) => ({
    ...view,
    profiles: profiles?.find((p) => p.user_id === view.user_id) || null,
  }))

  const { data: moderationAlerts } = await supabase
    .from("moderation_alerts")
    .select(
      `
      *
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  const alertUserIds = moderationAlerts?.map((a) => a.user_id).filter(Boolean) || []
  const { data: alertProfiles } =
    alertUserIds.length > 0
      ? await supabase.from("profiles").select("user_id, display_name, email").in("user_id", alertUserIds)
      : { data: [] }

  // Merge profiles into moderation alerts
  const moderationAlertsWithProfiles = moderationAlerts?.map((alert) => ({
    ...alert,
    profiles: alertProfiles?.find((p) => p.user_id === alert.user_id) || null,
  }))

  const { data: learningStandards } = await supabase
    .from("learning_standards")
    .select("*")
    .order("level_order", { ascending: true })

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <AdminDashboard
        stats={stats}
        userActivity={userActivity}
        phrases={phrases || []}
        recentViews={recentViewsWithProfiles || []}
        moderationAlerts={moderationAlertsWithProfiles || []}
        learningStandards={learningStandards || []}
      />
    </div>
  )
}
