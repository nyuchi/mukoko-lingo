import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { checkIsAdmin } from "@/lib/supabase/admin"
import { AppSidebar } from "@/components/app-sidebar"
import { ModerationManagement } from "@/components/admin/moderation-management"

export default async function AdminModerationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const isAdmin = await checkIsAdmin(user.id)
  if (!isAdmin) redirect("/")

  // Fetch moderation alerts
  const { data: moderationAlerts } = await supabase
    .from("moderation_alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  // Fetch user profiles for the alerts
  const userIds = [...new Set(moderationAlerts?.map((a) => a.user_id) || [])]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, email, display_name")
    .in("user_id", userIds)

  // Merge profiles into alerts
  const alertsWithProfiles = moderationAlerts?.map((alert) => ({
    ...alert,
    profiles: profiles?.find((p) => p.user_id === alert.user_id),
  }))

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <ModerationManagement moderationAlerts={alertsWithProfiles || []} />
        </div>
      </main>
    </div>
  )
}
