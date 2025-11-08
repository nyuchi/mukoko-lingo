"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Info, Target, Scale, Shield, Bot } from "lucide-react"
import Link from "next/link"
import { translations, type UILanguage } from "@/lib/translations"

interface NavigationMenuProps {
  uiLanguage: UILanguage
}

export function NavigationMenu({ uiLanguage }: NavigationMenuProps) {
  const [open, setOpen] = useState(false)
  const t = translations[uiLanguage]

  const navigationItems = [
    { href: "/", icon: Home, label: t.navHome, description: t.navHomeDesc },
    { href: "/about", icon: Info, label: t.navAbout, description: t.navAboutDesc },
    { href: "/why", icon: Target, label: t.navWhy, description: t.navWhyDesc },
    { href: "/ai-policy", icon: Bot, label: t.navAIPolicy, description: t.navAIPolicyDesc },
    { href: "/terms", icon: Scale, label: t.navTerms, description: t.navTermsDesc },
    { href: "/privacy", icon: Shield, label: t.navPrivacy, description: t.navPrivacyDesc },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Navigation menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-4">
        <SheetHeader className="mb-3">
          <SheetTitle className="text-left text-base">{t.navigation}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">{item.description}</span>
              </div>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
