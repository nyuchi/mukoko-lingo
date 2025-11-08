import { createClient } from "@/lib/supabase/server"
import { ClientPage } from "@/components/client-page"
import type { Phrase } from "@/lib/phrases-data"

async function getPhrases(): Promise<Phrase[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("phrases").select("*").order("category", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching phrases:", error)
    return []
  }

  return (data || []).map((row) => ({
    id: row.id,
    category: row.category,
    english: row.english,
    shona: row.shona,
    ndebele: row.ndebele,
    chinese: row.chinese,
    pronunciation: {
      english: row.english_pronunciation,
      shona: row.shona_pronunciation,
      ndebele: row.ndebele_pronunciation,
      chinese: row.chinese_pronunciation,
    },
    context: {
      en: row.english_context,
      sn: row.shona_context,
      nd: row.ndebele_context,
      zh: row.chinese_context,
    },
  }))
}

async function getUserBookmarks(): Promise<string[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase.from("bookmarks").select("phrase_id").eq("user_id", user.id)

  if (error) {
    console.error("[v0] Error fetching bookmarks:", error)
    return []
  }

  return (data || []).map((row) => row.phrase_id)
}

export default async function Page() {
  const [phrases, bookmarks] = await Promise.all([getPhrases(), getUserBookmarks()])

  return <ClientPage initialPhrases={phrases} initialBookmarks={bookmarks} />
}
