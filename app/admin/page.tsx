import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { isAdmin, getAdminStats, getUserActivitySummary } from "@/lib/supabase/admin"
import { AdminDashboard } from "@/components/admin-dashboard"

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

  // Fetch recent activity
  const { data: recentViews } = await supabase
    .from("phrase_views")
    .select(`
      *,
      phrases(english, shona, ndebele, chinese),
      profiles(display_name, email)
    `)
    .order("viewed_at", { ascending: false })
    .limit(20)

  const { data: moderationAlerts } = await supabase
    .from("moderation_alerts")
    .select(
      `
      *,
      profiles!moderation_alerts_user_id_fkey(email, display_name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: learningStandards } = await supabase
    .from("learning_standards")
    .select("*")
    .order("level_order", { ascending: true })

  return (
    <AdminDashboard
      stats={stats}
      userActivity={userActivity}
      phrases={phrases || []}
      recentViews={recentViews || []}
      moderationAlerts={moderationAlerts || []}
      learningStandards={learningStandards || []}
    />
  )
}
