import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { checkIsAdmin } from "@/lib/supabase/admin"
import { AppSidebar } from "@/components/app-sidebar"
import { LearningStandardsManager } from "@/components/learning-standards-manager"

export default async function AdminStandardsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth")

  const isAdmin = await checkIsAdmin(user.id)
  if (!isAdmin) redirect("/")

  const { data: learningStandards } = await supabase
    .from("learning_standards")
    .select("*")
    .order("level", { ascending: true })

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          <LearningStandardsManager standards={learningStandards || []} />
        </div>
      </main>
    </div>
  )
}
