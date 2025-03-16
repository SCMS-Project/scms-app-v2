"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Upload, Download, Plus, MessageSquare, FileText, Clock, Users, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { api } from "@/app/services/api"
import type {
  CollaborationGroup,
  CollaborationMessage,
  CollaborationFile,
  CollaborationTask,
  CollaborationMember,
} from "@/app/types"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender: string
  time: string
  content: string
}

interface SharedFile {
  id: string
  name: string
  size: string
  date: string
}

interface Task {
  id: string
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  dueDate: string
  status: "To Do" | "In Progress" | "Review" | "Completed"
  assignee?: string
}

interface GroupMember {
  id: string
  name: string
  role: string
  email: string
  department: string
}

export default function CollaborationPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("CG001")
  const [groups, setGroups] = useState<CollaborationGroup[]>([])
  const [messages, setMessages] = useState<CollaborationMessage[]>([])
  const [sharedFiles, setSharedFiles] = useState<CollaborationFile[]>([])
  const [tasks, setTasks] = useState<CollaborationTask[]>([])
  const [members, setMembers] = useState<CollaborationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState("CS 101 - Project Group")
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    department: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all collaboration groups
        const groupsData = await api.getCollaborationGroups()
        setGroups(groupsData)

        if (groupsData.length > 0) {
          const defaultGroupId = selectedGroupId || groupsData[0].id
          setSelectedGroupId(defaultGroupId)

          // Fetch data for the selected group
          const [messagesData, filesData, tasksData, groupData] = await Promise.all([
            api.getCollaborationMessages(defaultGroupId),
            api.getCollaborationFiles(defaultGroupId),
            api.getCollaborationTasks(defaultGroupId),
            api.getCollaborationGroup(defaultGroupId),
          ])

          setMessages(messagesData)
          setSharedFiles(filesData)
          setTasks(tasksData)
          setMembers(groupData.members || [])
          setSelectedGroup(groupData.name)
        }
      } catch (error) {
        console.error("Error fetching collaboration data:", error)
        setError("Failed to load collaboration data. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load collaboration data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedGroupId])

  const handleRetry = () => {
    setError(null)
    setSelectedGroupId(selectedGroupId) // This will trigger the useEffect to fetch data again
  }

  // If there's an error, show the error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRetry} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewGroup((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setNewGroup((prev) => ({ ...prev, [id]: value }))
  }

  const handleGroupChange = async (groupId: string) => {
    setSelectedGroupId(groupId)
    setLoading(true)

    try {
      // Fetch data for the selected group
      const [messagesData, filesData, tasksData, groupData] = await Promise.all([
        api.getCollaborationMessages(groupId),
        api.getCollaborationFiles(groupId),
        api.getCollaborationTasks(groupId),
        api.getCollaborationGroup(groupId),
      ])

      setMessages(messagesData)
      setSharedFiles(filesData)
      setTasks(tasksData)
      setMembers(groupData.members)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load group data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    try {
      setLoading(true)

      // Create the new group via API
      const createdGroup = await api.createCollaborationGroup({
        name: newGroup.name,
        description: newGroup.description,
        department: newGroup.department,
      })

      // Add the new group to the list
      setGroups((prev) => [...prev, createdGroup])

      // Close the dialog and reset the form
      setIsCreateGroupOpen(false)
      setNewGroup({
        name: "",
        description: "",
        department: "",
      })

      // Show a success message
      toast({
        title: "Success",
        description: "Group created successfully!",
      })

      // Select the new group
      setSelectedGroupId(createdGroup.id)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Collaboration</h1>
          <p className="text-muted-foreground">Collaborate with your peers, share files, and manage group projects</p>
        </div>
        <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="mr-2 h-4 w-4" /> Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collaboration Group</DialogTitle>
              <DialogDescription>
                Create a new group to collaborate with your peers on projects and assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Group Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., CS 101 Project Team"
                  className="col-span-3"
                  value={newGroup.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Select onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Medicine">Medicine</SelectItem>
                    <SelectItem value="Arts">Arts</SelectItem>
                    <SelectItem value="Sciences">Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this group..."
                  className="col-span-3"
                  value={newGroup.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={!newGroup.name}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <Select value={selectedGroupId} onValueChange={handleGroupChange}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" />
            Group Chat
          </TabsTrigger>
          <TabsTrigger value="files">
            <FileText className="mr-2 h-4 w-4" />
            Shared Files
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Clock className="mr-2 h-4 w-4" />
            Task Management
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="mr-2 h-4 w-4" />
            Group Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="h-[600px] space-y-4 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{message.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{message.sender}</span>
                        <span className="text-sm text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Input placeholder="Type your message..." />
                <Button>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Shared Files</CardTitle>
                  <CardDescription>Access and share files with your group members</CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload File
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search files..." className="flex-1" />
              </div>
              <div className="space-y-2">
                {sharedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.size} • {file.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>Manage and track group tasks and assignments</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {["To Do", "In Progress", "Review", "Completed"].map((status) => (
                  <div key={status}>
                    <h3 className="mb-4 font-semibold">{status}</h3>
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.status === status)
                        .map((task) => (
                          <Card key={task.id}>
                            <CardContent className="p-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Badge variant={task.priority === "High" ? "destructive" : "secondary"}>
                                    {task.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Due: {task.dueDate}</span>
                                  {task.assignee && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback>{task.assignee[0]}</AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Group Members</CardTitle>
              <CardDescription>View and manage members of your group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{member.name}</p>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-sm text-muted-foreground">{member.department}</p>
                      </div>
                    </div>
                    <Button variant="ghost">Message</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

