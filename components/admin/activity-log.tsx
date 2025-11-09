"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

interface RecentView {
  id: string
  user_id: string
  phrase_id: string
  viewed_at: string
  phrases?: {
    english: string
    shona?: string
    ndebele?: string
    chinese?: string
  } | null
  profiles?: {
    email: string
    display_name?: string
  } | null
}

interface ActivityLogProps {
  recentViews: RecentView[]
}

export function ActivityLog({ recentViews }: ActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest user interactions across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentViews.map((view, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">{view.profiles?.display_name || "Unknown User"}</p>
                <p className="text-sm text-muted-foreground">Viewed: {view.phrases?.english}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{new Date(view.viewed_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
