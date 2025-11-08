"use client"

import { useState } from "react"
import { CategoryNav } from "@/components/category-nav"
import { PhraseComparison } from "@/components/phrase-comparison"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Languages } from "lucide-react"
import { phrases } from "@/lib/phrases-data"
import { translations, type UILanguage } from "@/lib/translations"

export default function Page() {
  const [activeCategory, setActiveCategory] = useState("greetings")
  const [uiLanguage, setUILanguage] = useState<UILanguage>("en")
  const [bookmarkedPhrases, setBookmarkedPhrases] = useState<string[]>([])

  const t = translations[uiLanguage]
  const categoryPhrases = phrases.filter((p) => p.category === activeCategory)

  const toggleBookmark = (phraseId: string) => {
    setBookmarkedPhrases((prev) =>
      prev.includes(phraseId) ? prev.filter((id) => id !== phraseId) : [...prev, phraseId],
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Languages className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Nyuchi Lingo</h1>
              <p className="text-xs text-muted-foreground">Nyuchi Learning</p>
            </div>
          </div>
          <LanguageSwitcher currentLanguage={uiLanguage} onLanguageChange={setUILanguage} />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{t.heroTitle}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty mb-8">{t.heroSubtitle}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <div className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-500/20">
            English
          </div>
          <div className="px-4 py-2 rounded-full bg-green-500/10 text-green-700 dark:text-green-300 text-sm font-medium border border-green-500/20">
            Shona
          </div>
          <div className="px-4 py-2 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-300 text-sm font-medium border border-orange-500/20">
            Ndebele
          </div>
          <div className="px-4 py-2 rounded-full bg-red-500/10 text-red-700 dark:text-red-300 text-sm font-medium border border-red-500/20">
            {t.chinese}
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} uiLanguage={uiLanguage} />

      {/* Phrases Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-6">
          {categoryPhrases.map((phrase) => (
            <PhraseComparison
              key={phrase.id}
              phrase={phrase}
              isBookmarked={bookmarkedPhrases.includes(phrase.id)}
              onToggleBookmark={() => toggleBookmark(phrase.id)}
              uiLanguage={uiLanguage}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>{t.footerText}</p>
        </div>
      </footer>
    </div>
  )
}
