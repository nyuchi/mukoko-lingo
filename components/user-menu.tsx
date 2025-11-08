"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, LogIn, Settings, Bookmark, TrendingUp, BarChart3, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (!user) {
    return (
      <Button asChild variant="default" size="sm">
        <a href="/auth/login">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </a>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="User menu">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.email}</span>
            <span className="text-xs text-muted-foreground">{user.user_metadata?.display_name || "Learner"}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/ai-practice">
            <MessageCircle className="mr-2 h-4 w-4" />
            AI Practice
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/progress">
            <TrendingUp className="mr-2 h-4 w-4" />
            My Progress
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/bookmarks">
            <Bookmark className="mr-2 h-4 w-4" />
            My Bookmarks
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/profile">
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
