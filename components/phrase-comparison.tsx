"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Volume2, Bookmark } from "lucide-react"
import type { Phrase } from "@/lib/phrases-data"
import { translations, type UILanguage } from "@/lib/translations"

interface PhraseComparisonProps {
  phrase: Phrase
  isBookmarked: boolean
  onToggleBookmark: () => void
  uiLanguage: UILanguage
}

export function PhraseComparison({ phrase, isBookmarked, onToggleBookmark, uiLanguage }: PhraseComparisonProps) {
  const t = translations[uiLanguage]

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const languageCards = [
    {
      lang: "english",
      text: phrase.english,
      pronunciation: phrase.pronunciation.english,
      color: "blue",
      speechLang: "en-US",
    },
    {
      lang: "shona",
      text: phrase.shona,
      pronunciation: phrase.pronunciation.shona,
      color: "green",
      speechLang: "sn-ZW",
    },
    {
      lang: "ndebele",
      text: phrase.ndebele,
      pronunciation: phrase.pronunciation.ndebele,
      color: "orange",
      speechLang: "nd-ZW",
    },
    {
      lang: "chinese",
      text: phrase.chinese,
      pronunciation: phrase.pronunciation.chinese,
      color: "red",
      speechLang: "zh-CN",
    },
  ]

  const colorClasses = {
    blue: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
    green: "border-green-500/30 bg-green-500/5 hover:bg-green-500/10",
    orange: "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10",
    red: "border-red-500/30 bg-red-500/5 hover:bg-red-500/10",
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Badge variant="secondary" className="mb-2">
            {t.categories[phrase.category as keyof typeof t.categories]}
          </Badge>
          <p className="text-sm text-muted-foreground">{phrase.context[uiLanguage]}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleBookmark} className={isBookmarked ? "text-primary" : ""}>
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {languageCards.map((card) => (
          <div
            key={card.lang}
            className={`rounded-lg border-2 p-4 transition-colors ${colorClasses[card.color as keyof typeof colorClasses]}`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                {card.lang === "english"
                  ? t.english
                  : card.lang === "shona"
                    ? t.shona
                    : card.lang === "ndebele"
                      ? t.ndebele
                      : t.chinese}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-60 hover:opacity-100"
                onClick={() => handleSpeak(card.text, card.speechLang)}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-lg font-medium mb-2">{card.text}</p>
            <p className="text-xs text-muted-foreground italic">
              {t.pronunciation}: {card.pronunciation}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
