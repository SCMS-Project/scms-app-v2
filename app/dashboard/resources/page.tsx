"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Import the API service
import { api } from "@/app/services/api"
import type { Resource } from "@/app/types"
import { useAuth } from "@/app/contexts/auth-context"

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newResource, setNewResource] = useState({
    name: "",
    type: "",
    location: "",
    status: "Available",
  })

  const { user } = useAuth()
  const { toast } = useToast()

  // Fetch resources data
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const data = await api.getResources()
        setResources(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch resources data")
        toast({
          title: "Error",
          description: "Failed to load resources data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [toast])

  // Filter resources based on search query
  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewResource((prev) => ({ ...prev, [id]: value }))
  }

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setNewResource((prev) => ({ ...prev, [id]: value }))
  }

  // Handle resource creation
  const handleCreateResource = async () => {
    try {
      setLoading(true)
      // In a real app, we would upload the file here
      const createdResource = await api.checkoutResource(
        `RS${String(resources.length + 1).padStart(3, "0")}`,
        user?.id || "",
        user?.name || "",
      )
      setResources((prev) => [...prev, createdResource])
      toast({
        title: "Success",
        description: "Resource added successfully",
      })
      // Reset form
      setNewResource({
        name: "",
        type: "",
        location: "",
        status: "Available",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle resource checkout/return
  const handleResourceAction = async (id: string, action: "checkout" | "return") => {
    try {
      setLoading(true)
      let updatedResource

      if (action === "checkout") {
        updatedResource = await api.checkoutResource(id, user?.id || "", user?.name || "")
      } else {
        updatedResource = await api.returnResource(id)
      }

      setResources((prev) => prev.map((resource) => (resource.id === id ? updatedResource : resource)))

      toast({
        title: "Success",
        description: `Resource ${action === "checkout" ? "checked out" : "returned"} successfully`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to ${action} resource. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Upload Resource</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
              <DialogDescription>Upload a new resource for students, faculty, or staff</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" value={newResource.name} onChange={handleInputChange} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Select onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Building">Main Building</SelectItem>
                    <SelectItem value="Science Center">Science Center</SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
                    <SelectItem value="Arts Building">Arts Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input id="file" type="file" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateResource}
                disabled={loading || !newResource.name || !newResource.type || !newResource.location}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Resources</CardTitle>
              <CardDescription>View and manage all campus resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p>Loading resources...</p>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-64 text-red-500">
                    <p>{error}</p>
                  </div>
                ) : filteredResources.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Name</th>
                          <th className="p-2 text-left font-medium">Type</th>
                          <th className="p-2 text-left font-medium">Location</th>
                          <th className="p-2 text-left font-medium">Status</th>
                          <th className="p-2 text-left font-medium">Checked Out By</th>
                          <th className="p-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map((resource: Resource) => (
                          <tr key={resource.id} className="border-b">
                            <td className="p-2">{resource.name}</td>
                            <td className="p-2">{resource.type}</td>
                            <td className="p-2">{resource.location}</td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  resource.status === "Available"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : resource.status === "In Use"
                                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                }`}
                              >
                                {resource.status}
                              </span>
                            </td>
                            <td className="p-2">{resource.checkedOutBy || "-"}</td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                {resource.status === "Available" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResourceAction(resource.id, "checkout")}
                                  >
                                    Check Out
                                  </Button>
                                ) : resource.status === "In Use" ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResourceAction(resource.id, "return")}
                                  >
                                    Return
                                  </Button>
                                ) : (
                                  <Button variant="ghost" size="sm" disabled>
                                    Unavailable
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-64 text-muted-foreground">
                    <p>No resources found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>View and manage document resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p>Loading documents...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Name</th>
                          <th className="p-2 text-left font-medium">Location</th>
                          <th className="p-2 text-left font-medium">Status</th>
                          <th className="p-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources
                          .filter((resource) => resource.type === "document")
                          .map((resource: Resource) => (
                            <tr key={resource.id} className="border-b">
                              <td className="p-2">{resource.name}</td>
                              <td className="p-2">{resource.location}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    resource.status === "Available"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  }`}
                                >
                                  {resource.status}
                                </span>
                              </td>
                              <td className="p-2">
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>View and manage video resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p>Loading videos...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Name</th>
                          <th className="p-2 text-left font-medium">Location</th>
                          <th className="p-2 text-left font-medium">Status</th>
                          <th className="p-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources
                          .filter((resource) => resource.type === "video")
                          .map((resource: Resource) => (
                            <tr key={resource.id} className="border-b">
                              <td className="p-2">{resource.name}</td>
                              <td className="p-2">{resource.location}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    resource.status === "Available"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  }`}
                                >
                                  {resource.status}
                                </span>
                              </td>
                              <td className="p-2">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
              <CardDescription>View and manage equipment resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button type="submit">Search</Button>
                </div>
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <p>Loading equipment...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Name</th>
                          <th className="p-2 text-left font-medium">Location</th>
                          <th className="p-2 text-left font-medium">Status</th>
                          <th className="p-2 text-left font-medium">Checked Out By</th>
                          <th className="p-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources
                          .filter((resource) => resource.type === "equipment")
                          .map((resource: Resource) => (
                            <tr key={resource.id} className="border-b">
                              <td className="p-2">{resource.name}</td>
                              <td className="p-2">{resource.location}</td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    resource.status === "Available"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : resource.status === "In Use"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {resource.status}
                                </span>
                              </td>
                              <td className="p-2">{resource.checkedOutBy || "-"}</td>
                              <td className="p-2">
                                <div className="flex space-x-2">
                                  {resource.status === "Available" ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleResourceAction(resource.id, "checkout")}
                                    >
                                      Check Out
                                    </Button>
                                  ) : resource.status === "In Use" ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleResourceAction(resource.id, "return")}
                                    >
                                      Return
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="sm" disabled>
                                      Unavailable
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

