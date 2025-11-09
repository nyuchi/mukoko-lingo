"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { isDevMode } from "@/lib/dev-mode"

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdmin()
  }, [])

  async function checkAdmin() {
    try {
      const devMode = isDevMode()
      console.log("[v0] useAdmin - Dev mode check:", devMode)

      if (devMode) {
        console.log("[v0] useAdmin - Granting admin access via dev mode")
        setIsAdmin(true)
        setLoading(false)
        return
      }

      const supabase = createBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log("[v0] useAdmin - No user found")
        setIsAdmin(false)
        return
      }

      const { data } = await supabase.from("profiles").select("role").eq("user_id", user.id).single()

      console.log("[v0] useAdmin - User role:", data?.role)
      setIsAdmin(data?.role === "admin")
    } catch (error) {
      console.error("Error checking admin status:", error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  return { isAdmin, loading }
}
