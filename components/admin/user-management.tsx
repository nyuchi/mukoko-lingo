"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface UserActivity {
  user_id: string
  email: string
  display_name: string
  role: string
  total_views: number
  total_bookmarks: number
  total_progress: number
  last_active: string
}

interface UserManagementProps {
  userActivity: UserActivity[]
}

export function UserManagement({ userActivity }: UserManagementProps) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<UserActivity | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<"user" | "admin">("user")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [userSortField, setUserSortField] = useState<keyof UserActivity>("email")
  const [userSortDirection, setUserSortDirection] = useState<"asc" | "desc">("asc")

  const filteredUsers = useMemo(() => {
    const filtered = userActivity.filter(
      (user) =>
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(userSearchTerm.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      const aVal = a[userSortField]
      const bVal = b[userSortField]
      const modifier = userSortDirection === "asc" ? 1 : -1

      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * modifier
      }
      return ((aVal as number) - (bVal as number)) * modifier
    })
  }, [userActivity, userSearchTerm, userSortField, userSortDirection])

  const toggleUserSort = (field: keyof UserActivity) => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === "asc" ? "desc" : "asc")
    } else {
      setUserSortField(field)
      setUserSortDirection("asc")
    }
  }

  const SortIcon = ({
    field,
    currentField,
    direction,
  }: { field: string; currentField: string; direction: "asc" | "desc" }) => {
    if (field !== currentField) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return direction === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.user_id, role: newRole }),
      })

      if (!response.ok) throw new Error("Failed to update role")

      setIsRoleDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error updating role:", error)
      alert("Failed to update user role")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">User Management</CardTitle>
          <CardDescription>View and manage user accounts and roles</CardDescription>
          <div className="pt-4 flex gap-4 items-center">
            <Input
              placeholder="Search users by email or name..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {userActivity.length} users
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("email")}
                        className="hover:bg-transparent"
                      >
                        User
                        <SortIcon field="email" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("role")}
                        className="hover:bg-transparent"
                      >
                        Role
                        <SortIcon field="role" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("total_views")}
                        className="hover:bg-transparent"
                      >
                        Views
                        <SortIcon field="total_views" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("total_bookmarks")}
                        className="hover:bg-transparent"
                      >
                        Bookmarks
                        <SortIcon field="total_bookmarks" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("total_progress")}
                        className="hover:bg-transparent"
                      >
                        Progress
                        <SortIcon field="total_progress" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserSort("last_active")}
                        className="hover:bg-transparent"
                      >
                        Last Active
                        <SortIcon field="last_active" currentField={userSortField} direction={userSortDirection} />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div>
                          <p className="font-medium">{user.display_name || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      </td>
                      <td className="p-4 align-middle text-right">{user.total_views}</td>
                      <td className="p-4 align-middle text-right">{user.total_bookmarks}</td>
                      <td className="p-4 align-middle text-right">{user.total_progress}</td>
                      <td className="p-4 align-middle">
                        {user.last_active ? new Date(user.last_active).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role as "user" | "admin")
                            setIsRoleDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>Change the role for {selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={(value: "user" | "admin") => setNewRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
