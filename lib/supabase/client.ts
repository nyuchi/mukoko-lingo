import { createBrowserClient as createBrowserClientBase } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClientBase> | undefined

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClientBase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  return client
}

export function createBrowserClient() {
  return createBrowserClientBase(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
