"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/app/services/api"
import { useAuth } from "@/app/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ROLES } from "@/app/constants/roles"

export default function UserPermissionsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editedPermissions, setEditedPermissions] = useState({})

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== ROLES.ADMIN) {
      window.location.href = "/dashboard"
    }
  }, [user])

  // Fetch permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getUserPermissions()
        setPermissions(data)

        // Initialize edited permissions
        const initialEdited = {}
        data.forEach((user) => {
          initialEdited[user.userId] = { ...user.permissions }
        })
        setEditedPermissions(initialEdited)
      } catch (err) {
        console.error("Failed to fetch permissions:", err)
        setError("Failed to load user permissions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  // Handle permission toggle
  const handleTogglePermission = (userId, permissionKey) => {
    setEditedPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [permissionKey]: !prev[userId][permissionKey],
      },
    }))
  }

  // Save permissions
  const handleSavePermissions = async (userId) => {
    try {
      setSaving(true)
      const result = await api.updateUserPermission(userId, editedPermissions[userId])

      if (result.success) {
        toast({
          title: "Permissions Updated",
          description: `Permissions for user have been updated successfully.`,
        })

        // Update local state
        setPermissions((prev) =>
          prev.map((user) => (user.userId === userId ? { ...user, permissions: editedPermissions[userId] } : user)),
        )
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: result.message || "Failed to update permissions.",
        })
      }
    } catch (err) {
      console.error("Error saving permissions:", err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving permissions.",
      })
    } finally {
      setSaving(false)
    }
  }

  // Check if permissions have changed
  const hasPermissionsChanged = (userId) => {
    const original = permissions.find((p) => p.userId === userId)?.permissions || {}
    const edited = editedPermissions[userId] || {}

    return Object.keys(edited).some((key) => original[key] !== edited[key])
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading permissions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">User Permissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage User Permissions</CardTitle>
          <CardDescription>Control what actions different users can perform in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Manage Users</TableHead>
                <TableHead>Manage Courses</TableHead>
                <TableHead>Manage Schedule</TableHead>
                <TableHead>View Reports</TableHead>
                <TableHead>Approve Requests</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((userPerm) => (
                <TableRow key={userPerm.userId}>
                  <TableCell className="font-medium">{userPerm.username}</TableCell>
                  <TableCell>{userPerm.role}</TableCell>
                  <TableCell>
                    <Switch
                      checked={editedPermissions[userPerm.userId]?.canManageUsers || false}
                      onCheckedChange={() => handleTogglePermission(userPerm.userId, "canManageUsers")}
                      disabled={userPerm.role === ROLES.ADMIN} // Admin always has all permissions
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={editedPermissions[userPerm.userId]?.canManageCourses || false}
                      onCheckedChange={() => handleTogglePermission(userPerm.userId, "canManageCourses")}
                      disabled={userPerm.role === ROLES.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={editedPermissions[userPerm.userId]?.canManageSchedule || false}
                      onCheckedChange={() => handleTogglePermission(userPerm.userId, "canManageSchedule")}
                      disabled={userPerm.role === ROLES.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={editedPermissions[userPerm.userId]?.canViewReports || false}
                      onCheckedChange={() => handleTogglePermission(userPerm.userId, "canViewReports")}
                      disabled={userPerm.role === ROLES.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={editedPermissions[userPerm.userId]?.canApproveRequests || false}
                      onCheckedChange={() => handleTogglePermission(userPerm.userId, "canApproveRequests")}
                      disabled={userPerm.role === ROLES.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleSavePermissions(userPerm.userId)}
                      disabled={saving || !hasPermissionsChanged(userPerm.userId) || userPerm.role === ROLES.ADMIN}
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

