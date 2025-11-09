"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Home,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Bookmark,
  BarChart3,
  Settings,
  Shield,
  Users,
  GraduationCap,
  Activity,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserMenu } from "@/components/user-menu"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useAdmin } from "@/lib/hooks/use-admin"
import { useDevAuth } from "@/lib/hooks/use-dev-auth"

interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

interface NavSection {
  title: string
  items: NavItem[]
}

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [moderationCount, setModerationCount] = useState(0)
  const { user } = useDevAuth()
  const { isAdmin, loading } = useAdmin()
  const supabase = createClient()

  useEffect(() => {
    console.log("[v0] AppSidebar - user:", user?.id, "isAdmin:", isAdmin, "loading:", loading)
  }, [user, isAdmin, loading])

  useEffect(() => {
    // Fetch moderation alerts count for admins
    const fetchModerationCount = async () => {
      if (!isAdmin) return

      const { count } = await supabase
        .from("moderation_alerts")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      setModerationCount(count || 0)
    }

    fetchModerationCount()
  }, [isAdmin, supabase])

  // User navigation sections
  const userSections: NavSection[] = [
    {
      title: "Main",
      items: [
        { id: "home", label: "Home", href: "/", icon: Home },
        { id: "phrases", label: "Browse Phrases", href: "/#phrases", icon: BookOpen },
        { id: "ai-practice", label: "AI Tutor", href: "/ai-practice", icon: MessageSquare },
      ],
    },
    {
      title: "Learning",
      items: [
        { id: "progress", label: "My Progress", href: "/progress", icon: TrendingUp },
        { id: "bookmarks", label: "My Bookmarks", href: "/bookmarks", icon: Bookmark },
        { id: "analytics", label: "Analytics", href: "/analytics", icon: BarChart3 },
      ],
    },
    {
      title: "Account",
      items: [{ id: "profile", label: "Profile Settings", href: "/profile", icon: Settings }],
    },
  ]

  // Admin navigation section (only shown if user is admin)
  const adminSection: NavSection = {
    title: "Administration",
    items: [
      { id: "admin-overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
      { id: "admin-users", label: "Users", href: "/admin#users", icon: Users },
      { id: "admin-phrases", label: "Phrases", href: "/admin#phrases", icon: BookOpen },
      { id: "admin-standards", label: "Standards", href: "/admin#standards", icon: GraduationCap },
      {
        id: "admin-moderation",
        label: "Moderation",
        href: "/admin#moderation",
        icon: Shield,
        badge: moderationCount,
      },
      { id: "admin-activity", label: "Activity", href: "/admin#activity", icon: Activity },
    ],
  }

  const renderNavSection = (section: NavSection) => (
    <div key={section.title} className="mb-6">
      <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {section.title}
      </h3>
      <nav className="space-y-1">
        {section.items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors mx-2",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-accent/30 border-r transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b bg-background/50">
            <Link href="/" className="font-serif text-lg font-bold" onClick={() => setIsOpen(false)}>
              Nyuchi Lingo
            </Link>
            <UserMenu />
          </div>

          {/* Scrollable nav content */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* User sections */}
            {userSections.map(renderNavSection)}

            {/* Admin section - only shown if user is admin */}
            {isAdmin && (
              <>
                <div className="mx-4 my-6 border-t" />
                {renderNavSection(adminSection)}
              </>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="border-t p-4 bg-background/50">
            <p className="text-xs text-muted-foreground text-center">Nyuchi Lingo © 2025</p>
          </div>
        </div>
      </aside>
    </>
  )
}
