"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import type { UILanguage } from "@/lib/translations"

interface LanguageSwitcherProps {
  currentLanguage: UILanguage
  onLanguageChange: (lang: UILanguage) => void
}

export function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const languages = [
    { code: "en" as UILanguage, name: "English", nativeName: "English" },
    { code: "sn" as UILanguage, name: "Shona", nativeName: "chiShona" },
    { code: "nd" as UILanguage, name: "Ndebele", nativeName: "isiNdebele" },
    { code: "zh" as UILanguage, name: "Chinese", nativeName: "中文" },
  ]

  const currentLang = languages.find((l) => l.code === currentLanguage)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang?.nativeName}</span>
          <span className="sm:hidden">{currentLang?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={currentLanguage === lang.code ? "bg-accent" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
