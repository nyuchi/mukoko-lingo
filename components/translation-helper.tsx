"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Globe, Loader2, BookmarkPlus } from "lucide-react"

interface TranslationHelp {
  translations: {
    english: string
    shona: string
    ndebele: string
    chinese: string
  }
  pronunciation: {
    english: string
    shona: string
    ndebele: string
    chinese: string
  }
  nuances: string
  commonMistakes: string[]
  culturalContext: string
  alternatives: string[]
  formalityLevel: string
  whenToUse: string
}

export function TranslationHelper() {
  const [text, setText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("english")
  const [help, setHelp] = useState<TranslationHelp | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getHelp = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/ai/translate-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLanguage }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to get translation help")
      }

      const data = await response.json()
      setHelp(data.help)
    } catch (err: any) {
      console.error("[v0] Translation help error:", err)
      setError(err.message || "Failed to get translation help")
    } finally {
      setLoading(false)
    }
  }

  const saveTranslation = async () => {
    if (!text.trim()) return

    try {
      await fetch("/api/ai/translate-help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-save-translation": "true",
        },
        body: JSON.stringify({ text, sourceLanguage }),
      })
      alert("Translation saved to your custom phrases!")
    } catch (err) {
      console.error("[v0] Save error:", err)
    }
  }

  return (
    <Card className="p-4 space-y-4">
      <h3 className="font-serif font-semibold flex items-center gap-2">
        <Globe className="h-5 w-5" />
        Translation Help
      </h3>

      <div className="space-y-2">
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="w-full p-2 border rounded-md bg-background text-sm"
        >
          <option value="english">English</option>
          <option value="shona">Shona</option>
          <option value="ndebele">Ndebele</option>
          <option value="chinese">Chinese</option>
        </select>

        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a phrase to translate..."
            onKeyDown={(e) => e.key === "Enter" && getHelp()}
          />
          <Button onClick={getHelp} disabled={loading || !text.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Translate"}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {help && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(help.translations).map(([lang, trans]) => (
              <div key={lang} className="space-y-1">
                <p className="text-xs font-medium capitalize">{lang}:</p>
                <p className="text-sm font-medium">{trans}</p>
                <p className="text-xs text-muted-foreground">
                  {help.pronunciation[lang as keyof typeof help.pronunciation]}
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Nuances:</p>
            <p className="text-sm text-muted-foreground">{help.nuances}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Cultural Context:</p>
            <p className="text-sm text-muted-foreground">{help.culturalContext}</p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">When to Use:</p>
            <p className="text-sm text-muted-foreground">{help.whenToUse}</p>
            <Badge variant="secondary" className="mt-1">
              {help.formalityLevel.replace("_", " ")}
            </Badge>
          </div>

          {help.commonMistakes.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-1">Common Mistakes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {help.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>
          )}

          {help.alternatives.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Alternative Expressions:</p>
              <div className="flex flex-wrap gap-2">
                {help.alternatives.map((alt, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {alt}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={saveTranslation} variant="outline" size="sm" className="w-full bg-transparent">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Save to My Phrases
          </Button>
        </div>
      )}
    </Card>
  )
}
