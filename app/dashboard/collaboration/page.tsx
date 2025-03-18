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
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    status: "To Do",
    assignee: "",
  })
  const [messageInput, setMessageInput] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("groups")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if the required API methods exist
        if (typeof api.getCollaborationGroups !== "function") {
          console.warn("api.getCollaborationGroups is not implemented, using fallback data")
          // Provide fallback data
          const fallbackGroups = [
            {
              id: "CG001",
              name: "CS 101 - Project Group",
              description: "Group for CS 101 course project collaboration",
              department: "Computer Science",
              members: [
                {
                  id: "M001",
                  name: "John Doe",
                  role: "Group Leader",
                  email: "john.doe@example.com",
                  department: "Computer Science",
                },
                {
                  id: "M002",
                  name: "Jane Smith",
                  role: "Member",
                  email: "jane.smith@example.com",
                  department: "Computer Science",
                },
              ],
            },
            {
              id: "CG002",
              name: "ENG 202 - Research Team",
              description: "Research collaboration for ENG 202",
              department: "Engineering",
              members: [],
            },
          ]

          setGroups(fallbackGroups)

          const defaultGroupId = selectedGroupId || fallbackGroups[0].id
          setSelectedGroupId(defaultGroupId)

          // Set fallback data for the selected group
          const selectedFallbackGroup = fallbackGroups.find((g) => g.id === defaultGroupId) || fallbackGroups[0]

          const fallbackMessages = [
            {
              id: "MSG001",
              sender: "John Doe",
              time: "10:30 AM",
              content: "Has everyone started on their part of the project?",
            },
            {
              id: "MSG002",
              sender: "Jane Smith",
              time: "10:35 AM",
              content: "Yes, I've completed the initial research and will share my findings soon.",
            },
            {
              id: "MSG003",
              sender: "Michael Johnson",
              time: "10:40 AM",
              content: "I'm still working on the data analysis section. Should be done by tomorrow.",
            },
          ]

          const fallbackFiles = [
            {
              id: "F001",
              name: "Project Requirements.pdf",
              size: "2.4 MB",
              date: "2023-09-15",
            },
            {
              id: "F002",
              name: "Research Notes.docx",
              size: "1.8 MB",
              date: "2023-09-18",
            },
          ]

          const fallbackTasks = [
            {
              id: "T001",
              title: "Complete Literature Review",
              description: "Review at least 10 academic papers related to the topic",
              priority: "High",
              dueDate: "2023-10-05",
              status: "In Progress",
              assignee: "Jane Smith",
            },
            {
              id: "T002",
              title: "Prepare Presentation Slides",
              description: "Create slides for the mid-term presentation",
              priority: "Medium",
              dueDate: "2023-10-10",
              status: "To Do",
              assignee: "John Doe",
            },
          ]

          setMessages(fallbackMessages)
          setSharedFiles(fallbackFiles)
          setTasks(fallbackTasks)
          setMembers(selectedFallbackGroup.members || [])
          setSelectedGroup(selectedFallbackGroup.name)

          setLoading(false)
          return
        }

        // Fetch all collaboration groups
        const groupsData = await api.getCollaborationGroups()
        setGroups(groupsData)

        if (groupsData.length > 0) {
          const defaultGroupId = selectedGroupId || groupsData[0].id
          setSelectedGroupId(defaultGroupId)

          // Find the selected group in the local state
          const selectedGroup = groupsData.find((g) => g.id === defaultGroupId)

          // If this is a newly created group (has no members yet), don't try to fetch data
          const isNewlyCreatedGroup = selectedGroup && selectedGroup.members && selectedGroup.members.length === 0

          if (isNewlyCreatedGroup) {
            console.log("Newly created group detected, skipping data fetch")
            setMessages([])
            setSharedFiles([])
            setTasks([])
            setMembers([])
            setSelectedGroup(selectedGroup.name)
            setLoading(false)
            return
          }

          // Check if the required API methods exist before calling them
          try {
            // Fetch data for the selected group
            const messagesPromise =
              typeof api.getCollaborationMessages === "function"
                ? api.getCollaborationMessages(defaultGroupId)
                : Promise.resolve([])

            const filesPromise =
              typeof api.getCollaborationFiles === "function"
                ? api.getCollaborationFiles(defaultGroupId)
                : Promise.resolve([])

            const tasksPromise =
              typeof api.getCollaborationTasks === "function"
                ? api.getCollaborationTasks(defaultGroupId)
                : Promise.resolve([])

            const groupPromise =
              typeof api.getCollaborationGroup === "function"
                ? api.getCollaborationGroup(defaultGroupId)
                : Promise.resolve({ members: [] })

            const [messagesData, filesData, tasksData, groupData] = await Promise.all([
              messagesPromise,
              filesPromise,
              tasksPromise,
              groupPromise,
            ])

            console.log("Fetched messages:", messagesData)

            // If messages is undefined or null, use an empty array
            setMessages(messagesData || [])
            setSharedFiles(filesData || [])
            setTasks(tasksData || [])
            setMembers(groupData.members || [])
            setSelectedGroup(groupData.name || groupsData.find((g) => g.id === defaultGroupId)?.name || "")
          } catch (error) {
            console.error("Error fetching group data:", error)

            // Check if this is a newly created group that doesn't exist in the backend yet
            if (error.toString().includes("not found")) {
              // For newly created groups, just use empty data
              setMessages([])
              setSharedFiles([])
              setTasks([])
              setMembers([])
              // Don't set error state for newly created groups
              toast({
                title: "New Group",
                description: "This group was just created. Start adding content!",
              })
            } else {
              setError("Failed to load group data. Please try again.")
              // Set fallback data
              setMessages([
                {
                  id: "MSG001",
                  sender: "John Doe",
                  time: "10:30 AM",
                  content: "Has everyone started on their part of the project?",
                },
                {
                  id: "MSG002",
                  sender: "Jane Smith",
                  time: "10:35 AM",
                  content: "Yes, I've completed the initial research and will share my findings soon.",
                },
              ])
            }
          }
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
    // First update the UI state to show the selected group
    setSelectedGroupId(groupId)
    setLoading(true)

    try {
      // Find the group in our local state first
      const selectedGroup = groups.find((g) => g.id === groupId)

      if (!selectedGroup) {
        throw new Error(`Group with ID ${groupId} not found in local state`)
      }

      // Update the selected group name from local state
      setSelectedGroup(selectedGroup.name)

      // For newly created groups, we might not have data in the backend yet
      // Check if this is a group we just created (it will have empty members array)
      const isNewlyCreatedGroup = selectedGroup.members && selectedGroup.members.length === 0

      if (isNewlyCreatedGroup) {
        // For newly created groups, initialize with empty data
        setMembers([])
        setMessages([])
        setSharedFiles([])
        setTasks([])
        setLoading(false)
        return
      }

      // For existing groups, try to fetch data
      try {
        // Check if the required API methods exist
        const messagesPromise =
          typeof api.getCollaborationMessages === "function"
            ? api.getCollaborationMessages(groupId)
            : Promise.resolve([])

        const filesPromise =
          typeof api.getCollaborationFiles === "function" ? api.getCollaborationFiles(groupId) : Promise.resolve([])

        const tasksPromise =
          typeof api.getCollaborationTasks === "function" ? api.getCollaborationTasks(groupId) : Promise.resolve([])

        const groupPromise =
          typeof api.getCollaborationGroup === "function"
            ? api.getCollaborationGroup(groupId)
            : Promise.resolve({ members: [] })

        // Fetch data for the selected group
        const [messagesData, filesData, tasksData, groupData] = await Promise.all([
          messagesPromise,
          filesPromise,
          tasksPromise,
          groupPromise,
        ])

        // If messages is undefined or null, use an empty array
        setMessages(messagesData || [])
        setSharedFiles(filesData || [])
        setTasks(tasksData || [])
        setMembers(groupData.members || [])
      } catch (error) {
        console.error(`Error fetching data for group ${groupId}:`, error)

        // If we can't fetch data, use empty arrays
        setMessages([])
        setSharedFiles([])
        setTasks([])
        setMembers([])

        // Only show a toast for non-new groups
        if (!isNewlyCreatedGroup) {
          toast({
            title: "Note",
            description: "This group was just created. Start adding content!",
          })
        }
      }
    } catch (error) {
      console.error("Error changing group:", error)
      toast({
        title: "Error",
        description: "Failed to load group. Please try again.",
        variant: "destructive",
      })

      // Set fallback data
      setMessages([])
      setSharedFiles([])
      setTasks([])
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async () => {
    // Validate required fields
    if (!newGroup.name || !newGroup.department) {
      toast({
        title: "Validation Error",
        description: "Group name and department are required.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      if (typeof api.createCollaborationGroup !== "function") {
        console.warn("api.createCollaborationGroup is not implemented, using fallback implementation")

        // Create a new group with a generated ID
        const newGroupId = `CG${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(3, "0")}`
        const createdGroup = {
          id: newGroupId,
          name: newGroup.name,
          description: newGroup.description || "",
          department: newGroup.department,
          members: [],
        }

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

        // Initialize empty data for the new group
        setSelectedGroupId(createdGroup.id)
        setSelectedGroup(createdGroup.name)
        setMembers([])
        setMessages([])
        setSharedFiles([])
        setTasks([])

        // Switch to the groups tab to show the new group
        setActiveTab("groups")

        return
      }

      // Create the new group via API
      const createdGroup = await api.createCollaborationGroup({
        name: newGroup.name,
        description: newGroup.description || "",
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

      // Initialize empty data for the new group instead of triggering a fetch
      setSelectedGroupId(createdGroup.id)
      setSelectedGroup(createdGroup.name)
      setMembers([])
      setMessages([])
      setSharedFiles([])
      setTasks([])

      // Switch to the groups tab to show the new group
      setActiveTab("groups")
    } catch (error) {
      console.error("Error creating group:", error)
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async () => {
    try {
      setLoading(true)

      if (typeof api.createCollaborationTask !== "function") {
        console.warn("api.createCollaborationTask is not implemented, using fallback implementation")

        // Create a new task with a generated ID
        const newTaskId = `T${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(3, "0")}`

        const createdTask = {
          id: newTaskId,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority as "High" | "Medium" | "Low",
          dueDate: newTask.dueDate,
          status: newTask.status as "To Do" | "In Progress" | "Review" | "Completed",
          assignee: newTask.assignee || undefined,
        }

        // Add the new task to the list
        setTasks((prev) => [...prev, createdTask])

        // Close the dialog and reset the form
        setIsAddTaskOpen(false)
        setNewTask({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
          status: "To Do",
          assignee: "",
        })

        // Show a success message
        toast({
          title: "Success",
          description: "Task created successfully!",
        })

        return
      }

      // Create the new task via API
      const createdTask = await api.createCollaborationTask(selectedGroupId, {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority as "High" | "Medium" | "Low",
        dueDate: newTask.dueDate,
        status: newTask.status as "To Do" | "In Progress" | "Review" | "Completed",
        assignee: newTask.assignee || undefined,
      })

      // Add the new task to the list
      setTasks((prev) => [...prev, createdTask])

      // Close the dialog and reset the form
      setIsAddTaskOpen(false)
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        status: "To Do",
        assignee: "",
      })

      // Show a success message
      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    try {
      // Update the task status in the local state
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))

      // Show success message
      toast({
        title: "Status Updated",
        description: "Task status has been updated successfully.",
      })

      // In a real implementation, you would also update the task on the server
      // if (typeof api.updateCollaborationTask === "function") {
      //   api.updateCollaborationTask(selectedGroupId, taskId, { status: newStatus });
      // }
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    try {
      // Create a new message
      const newMessage = {
        id: `MSG${Date.now()}`,
        groupId: selectedGroupId,
        sender: "You", // In a real app, this would be the current user's name
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: messageInput,
      }

      // Add the new message to the messages array
      setMessages((prev) => [...prev, newMessage])

      // Clear the input
      setMessageInput("")

      // In a real implementation, you would also send the message to the server
      // if (typeof api.createCollaborationMessage === "function") {
      //   api.createCollaborationMessage(selectedGroupId, { content: messageInput });
      // }

      // Show success toast
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the group.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
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
                  Group Name <span className="text-red-500">*</span>
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
                  Department <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => handleSelectChange("department", value)} value={newGroup.department}>
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
              <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup} disabled={!newGroup.name || !newGroup.department || loading}>
                {loading ? "Creating..." : "Create Group"}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="groups">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </TabsTrigger>
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
                {messages.length > 0 ? (
                  messages.map((message) => (
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
                  ))
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                  Send
                </Button>
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
                {sharedFiles.length > 0 ? (
                  sharedFiles.map((file) => (
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
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No files shared yet</p>
                  </div>
                )}
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
                <Button onClick={() => setIsAddTaskOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
                <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>Create a new task for your collaboration group.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          placeholder="Task title"
                          className="col-span-3"
                          value={newTask.title}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Task description"
                          className="col-span-3"
                          value={newTask.description}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priority" className="text-right">
                          Priority
                        </Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) => setNewTask((prev) => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Select
                          value={newTask.status}
                          onValueChange={(value) => setNewTask((prev) => ({ ...prev, status: value }))}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="To Do">To Do</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dueDate" className="text-right">
                          Due Date
                        </Label>
                        <Input
                          id="dueDate"
                          type="date"
                          className="col-span-3"
                          value={newTask.dueDate}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="assignee" className="text-right">
                          Assignee
                        </Label>
                        <Input
                          id="assignee"
                          placeholder="Assignee name"
                          className="col-span-3"
                          value={newTask.assignee}
                          onChange={(e) => setNewTask((prev) => ({ ...prev, assignee: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTask} disabled={!newTask.title}>
                        Create Task
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                                  <div className="mt-2 pt-2 border-t">
                                    <Select
                                      defaultValue={task.status}
                                      onValueChange={(value) => handleTaskStatusChange(task.id, value)}
                                    >
                                      <SelectTrigger className="h-8 text-xs">
                                        <SelectValue placeholder="Change status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="To Do">Move to To Do</SelectItem>
                                        <SelectItem value="In Progress">Move to In Progress</SelectItem>
                                        <SelectItem value="Review">Move to Review</SelectItem>
                                        <SelectItem value="Completed">Mark as Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        {tasks.filter((task) => task.status === status).length === 0 && (
                          <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground">No tasks</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-muted-foreground">No tasks created yet</p>
                </div>
              )}
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
                {members.length > 0 ? (
                  members.map((member) => (
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
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No members in this group yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Collaboration Groups</CardTitle>
              <CardDescription>View all available collaboration groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groups.length > 0 ? (
                  groups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{group.name}</h3>
                          <Badge variant="outline">{group.department}</Badge>
                        </div>
                        {group.description && <p className="text-sm text-muted-foreground mt-1">{group.description}</p>}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleGroupChange(group.id)}
                        disabled={selectedGroupId === group.id}
                      >
                        {selectedGroupId === group.id ? "Current" : "Select"}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No groups created yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

