import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { checkIsAdmin } from "@/lib/supabase/admin"
import { AppSidebar } from "@/components/app-sidebar"
import { ActivityLog } from "@/components/admin/activity-log"

export default async function AdminActivityPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const isAdmin = await checkIsAdmin(user.id)
  if (!isAdmin) redirect("/")

  // Fetch recent views with phrase and user info
  const { data: recentViews } = await supabase
    .from("phrase_views")
    .select("*, phrases(english, shona, ndebele, chinese)")
    .order("viewed_at", { ascending: false })
    .limit(20)

  // Fetch user profiles
  const userIds = [...new Set(recentViews?.map((v) => v.user_id) || [])]
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, email, display_name")
    .in("user_id", userIds)

  // Merge profiles into views
  const viewsWithProfiles = recentViews?.map((view) => ({
    ...view,
    profiles: profiles?.find((p) => p.user_id === view.user_id),
  }))

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <ActivityLog recentViews={viewsWithProfiles || []} />
        </div>
      </main>
    </div>
  )
}
