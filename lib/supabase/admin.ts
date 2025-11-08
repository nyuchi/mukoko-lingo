import { createServerClient } from "./server"

export async function isAdmin() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) return false

  const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (error) return false
  return data?.role === "admin"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) {
    throw new Error("Access denied. Admin privileges required.")
  }
  return true
}

export async function getAdminStats() {
  await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("admin_stats").select("*").single()

  if (error) throw error
  return data
}

export async function getUserActivitySummary() {
  await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.rpc("get_user_activity_summary")

  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("profiles").update({ role }).eq("id", userId)

  if (error) throw error
}

export async function createPhrase(phrase: {
  category: string
  english: string
  english_pronunciation: string
  english_context: string
  shona: string
  shona_pronunciation: string
  shona_context: string
  ndebele: string
  ndebele_pronunciation: string
  ndebele_context: string
  chinese: string
  chinese_pronunciation: string
  chinese_context: string
}) {
  await requireAdmin()
  const supabase = await createServerClient()

  const { data, error } = await supabase.from("phrases").insert([phrase]).select().single()

  if (error) throw error
  return data
}

export async function updatePhrase(
  id: string,
  updates: Partial<{
    category: string
    english: string
    english_pronunciation: string
    english_context: string
    shona: string
    shona_pronunciation: string
    shona_context: string
    ndebele: string
    ndebele_pronunciation: string
    ndebele_context: string
    chinese: string
    chinese_pronunciation: string
    chinese_context: string
  }>,
) {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("phrases").update(updates).eq("id", id)

  if (error) throw error
}

export async function deletePhrase(id: string) {
  await requireAdmin()
  const supabase = await createServerClient()

  const { error } = await supabase.from("phrases").delete().eq("id", id)

  if (error) throw error
}
