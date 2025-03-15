"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Camera, User, Bell, Shield, LogOut } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function Profile() {
  const { user, updateProfile, logout, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setProfileData((prev) => ({ ...prev, [id]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      await updateProfile(profileData)
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Profile update failed",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage || "/placeholder.svg?height=96&width=96"} alt={user.name} />
                  <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {user.role === "admin" ? "Administrator" : user.role === "faculty" ? "Faculty" : "Student"}
                  </div>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <Camera className="h-4 w-4" />
                  Change Photo
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Security
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-red-500" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Update your account information and preferences</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={profileData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileData.email} onChange={handleInputChange} />
                    </div>
                    {user.role !== "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input id="department" value={profileData.department} onChange={handleInputChange} />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={
                          user.role === "admin" ? "Administrator" : user.role === "faculty" ? "Faculty" : "Student"
                        }
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your role cannot be changed. Please contact an administrator if you need to change your role.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Notification preferences would go here */}
                  <p>Notification settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Security settings would go here */}
                  <p>Security settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

