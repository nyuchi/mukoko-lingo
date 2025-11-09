import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { checkIsAdmin, getUserActivitySummary } from "@/lib/supabase/admin"
import { AppSidebar } from "@/components/app-sidebar"
import { UserManagement } from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const isAdmin = await checkIsAdmin(user.id)
  if (!isAdmin) redirect("/")

  const userActivity = await getUserActivitySummary()

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <UserManagement userActivity={userActivity} />
        </div>
      </main>
    </div>
  )
}
