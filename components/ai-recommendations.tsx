"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, TrendingUp } from "lucide-react"
import { PhraseComparison } from "./phrase-comparison"

interface Recommendation {
  phraseId: string
  reason: string
  score: number
  difficulty: "beginner" | "intermediate" | "advanced"
  phrase: any
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchRecommendations = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/ai/recommend-phrases", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err) {
      console.error("[v0] Error fetching recommendations:", err)
      setError("Failed to load recommendations")
    } finally {
      setLoading(false)
    }
  }

  const markClicked = async (phraseId: string) => {
    // Track that user clicked on this recommendation
    const supabase = (await import("@/lib/supabase/client")).createClient()
    await supabase.from("ai_recommendations").update({ clicked: true }).eq("phrase_id", phraseId).eq("clicked", false)
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-serif font-semibold text-lg">AI Recommendations</h3>
        </div>
        <Button onClick={fetchRecommendations} disabled={loading} size="sm" variant="outline">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Get Recommendations
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Based on your learning progress, we recommend these phrases:</p>
          {recommendations.map((rec) => (
            <div key={rec.phraseId} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    rec.difficulty === "beginner"
                      ? "secondary"
                      : rec.difficulty === "intermediate"
                        ? "default"
                        : "destructive"
                  }
                >
                  {rec.difficulty}
                </Badge>
                <span className="text-xs text-muted-foreground">Match: {rec.score}%</span>
              </div>

              <p className="text-sm italic text-muted-foreground">{rec.reason}</p>

              {rec.phrase && (
                <div onClick={() => markClicked(rec.phraseId)}>
                  <PhraseComparison
                    phrase={rec.phrase}
                    index={0}
                    onProgressUpdate={() => {}}
                    onBookmarkToggle={() => {}}
                    isBookmarked={false}
                    currentProgress={null}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Click "Get Recommendations" to discover your next phrases to learn
          </p>
        )
      )}
    </Card>
  )
}
