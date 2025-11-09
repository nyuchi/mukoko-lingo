import Link from "next/link"
import Image from "next/image"
import { NavigationMenu } from "@/components/navigation-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { UserMenu } from "@/components/user-menu"
import type { UILanguage } from "@/lib/translations"

interface AppHeaderProps {
  uiLanguage?: UILanguage
  onLanguageChange?: (lang: UILanguage) => void
  showLanguageSwitcher?: boolean
}

export function AppHeader({ uiLanguage = "en", onLanguageChange, showLanguageSwitcher = true }: AppHeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <NavigationMenu uiLanguage={uiLanguage} />
          <Link href="/" aria-label="Nyuchi Lingo Home - Language Learning" className="flex items-center">
            <Image
              src="/bee-logo-mobile.png"
              alt="Nyuchi Lingo"
              width={40}
              height={40}
              className="h-8 w-8 sm:hidden"
              priority
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nyuchi_Lingo_purple-NSHTsUuDVYaiijQqQGE4nwsgdvohEK.png"
              alt="Nyuchi Lingo - Language Learning App"
              width={100}
              height={33}
              className="hidden sm:block h-10 w-auto dark:hidden"
              priority
            />
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nyuchi_Lingo_dark-FQBxd4oyoOqOeVfmPZaNiczf3SVPz5.png"
              alt="Nyuchi Lingo - Language Learning App"
              width={100}
              height={33}
              className="hidden sm:dark:block h-10 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {showLanguageSwitcher && onLanguageChange && (
            <LanguageSwitcher currentLanguage={uiLanguage} onLanguageChange={onLanguageChange} />
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
