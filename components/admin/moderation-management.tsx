"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"

interface ModerationAlert {
  id: string
  user_id: string
  content_type: string
  content_text: string
  flagged_reason: string
  status: string
  admin_notes?: string
  created_at: string
  profiles?: {
    email: string
    display_name?: string
  } | null
}

interface ModerationManagementProps {
  moderationAlerts: ModerationAlert[]
}

export function ModerationManagement({ moderationAlerts }: ModerationManagementProps) {
  const router = useRouter()
  const [isUserActionDialogOpen, setIsUserActionDialogOpen] = useState(false)
  const [selectedAlertUser, setSelectedAlertUser] = useState<{ id: string; email: string } | null>(null)
  const [userAction, setUserAction] = useState<"ban" | "deactivate" | "delete">("ban")
  const [actionReason, setActionReason] = useState("")

  const handleUserAction = async () => {
    if (!selectedAlertUser) return

    try {
      const response = await fetch("/api/admin/user-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedAlertUser.id,
          action: userAction,
          reason: actionReason,
        }),
      })

      if (!response.ok) throw new Error("Failed to perform user action")

      setIsUserActionDialogOpen(false)
      setActionReason("")
      router.refresh()
      alert(`User ${userAction}ed successfully`)
    } catch (error) {
      console.error("Error performing user action:", error)
      alert(`Failed to ${userAction} user`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Content Moderation
          </CardTitle>
          <CardDescription>Review flagged content and take appropriate action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moderationAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No flagged content to review</p>
            ) : (
              moderationAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={alert.status === "pending" ? "destructive" : "secondary"}>
                            {alert.status}
                          </Badge>
                          <Badge variant="outline">{alert.content_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">User: {alert.profiles?.email || "Unknown"}</p>
                        <div className="bg-muted/50 rounded p-3 mb-2">
                          <p className="text-sm">{alert.content_text}</p>
                        </div>
                        <p className="text-sm text-amber-600 dark:text-amber-400">Reason: {alert.flagged_reason}</p>
                        {alert.admin_notes && (
                          <p className="text-sm text-muted-foreground mt-2">Admin notes: {alert.admin_notes}</p>
                        )}
                      </div>
                    </div>
                    {alert.status === "pending" && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={async () => {
                            const notes = prompt("Add admin notes (optional):")
                            await fetch(`/api/admin/moderation/${alert.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "approved", admin_notes: notes }),
                            })
                            router.refresh()
                          }}
                        >
                          Approve Content
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            const notes = prompt("Add admin notes (required):")
                            if (!notes) return
                            await fetch(`/api/admin/moderation/${alert.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "removed", admin_notes: notes }),
                            })
                            router.refresh()
                          }}
                        >
                          Remove Content
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            const notes = prompt("Add admin notes:")
                            await fetch(`/api/admin/moderation/${alert.id}`, {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "reviewed", admin_notes: notes }),
                            })
                            router.refresh()
                          }}
                        >
                          Mark Reviewed
                        </Button>
                        <div className="w-full border-t pt-2 mt-2">
                          <p className="text-xs text-muted-foreground mb-2">User Actions:</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 bg-transparent"
                              onClick={() => {
                                setSelectedAlertUser({
                                  id: alert.user_id,
                                  email: alert.profiles?.email || "",
                                })
                                setUserAction("ban")
                                setIsUserActionDialogOpen(true)
                              }}
                            >
                              Ban User
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAlertUser({
                                  id: alert.user_id,
                                  email: alert.profiles?.email || "",
                                })
                                setUserAction("deactivate")
                                setIsUserActionDialogOpen(true)
                              }}
                            >
                              Deactivate User
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                              onClick={() => {
                                setSelectedAlertUser({
                                  id: alert.user_id,
                                  email: alert.profiles?.email || "",
                                })
                                setUserAction("delete")
                                setIsUserActionDialogOpen(true)
                              }}
                            >
                              Delete User
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUserActionDialogOpen} onOpenChange={setIsUserActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              {userAction === "delete" ? "Delete" : userAction === "ban" ? "Ban" : "Deactivate"} User
            </DialogTitle>
            <DialogDescription>
              This action will {userAction} the user: {selectedAlertUser?.email}
              {userAction === "delete" && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Warning: This action is permanent and cannot be undone!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="action">Action</Label>
              <Select value={userAction} onValueChange={(value: any) => setUserAction(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ban">Ban User (permanent restriction)</SelectItem>
                  <SelectItem value="deactivate">Deactivate User (temporary restriction)</SelectItem>
                  <SelectItem value="delete">Delete User (permanent removal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason (required)</Label>
              <Input
                id="reason"
                placeholder="Explain why this action is being taken..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleUserAction} disabled={!actionReason.trim()}>
              Confirm {userAction === "delete" ? "Deletion" : userAction === "ban" ? "Ban" : "Deactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
