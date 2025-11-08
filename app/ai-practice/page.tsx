import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AIPracticeClient } from "@/components/ai-practice-client"

export const metadata = {
  title: "AI Conversation Practice | Nyuchi Lingo",
  description: "Practice real conversations with AI in English, Shona, Ndebele, and Chinese",
}

export default async function AIPracticePage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/ai-practice")
  }

  return <AIPracticeClient />
}
