import type { CollaborationGroup, CollaborationMessage, CollaborationFile, CollaborationTask } from "@/app/types"

// Mock Collaboration Data
// Mock Collaboration Groups
export const mockCollaborationGroups: CollaborationGroup[] = [
  {
    id: "collab1",
    name: "Research Group Alpha",
    description: "Focused on AI and Machine Learning research",
    members: ["U001", "U003", "U005"],
    createdBy: "U001",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    type: "Research",
  },
  {
    id: "collab2",
    name: "Study Group Beta",
    description: "Preparing for advanced mathematics exams",
    members: ["U002", "U004", "U006"],
    createdBy: "U002",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    type: "Study",
  },
  {
    id: "collab3",
    name: "Project Team Gamma",
    description: "Working on the semester project for Software Engineering",
    members: ["U001", "U002", "U003", "U004"],
    createdBy: "U003",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: "Project",
  },
  {
    id: "collab4",
    name: "Discussion Forum Delta",
    description: "Open forum for discussing academic topics",
    members: ["U001", "U002", "U003", "U004", "U005", "U006"],
    createdBy: "U004",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    type: "Discussion",
  },
]

export const mockCollaborationMessages: CollaborationMessage[] = [
  {
    id: "CM001",
    groupId: "CG001",
    sender: "John Doe",
    time: "10:15 AM",
    content:
      "Hey everyone, I've started working on the project proposal. Does anyone have any specific topics they'd like to focus on?",
  },
  {
    id: "CM002",
    groupId: "CG001",
    sender: "Jane Smith",
    time: "10:18 AM",
    content: "I was thinking we could focus on machine learning applications in healthcare. What do you all think?",
  },
  {
    id: "CM003",
    groupId: "CG001",
    sender: "Michael Brown",
    time: "10:25 AM",
    content:
      "That sounds interesting. I've been reading about some recent advancements in that area. I can share some papers I found.",
  },
]

export const mockCollaborationFiles: CollaborationFile[] = [
  {
    id: "CF001",
    groupId: "CG001",
    name: "Project Proposal.docx",
    size: "2.4 MB",
    date: "Mar 10, 2025",
    uploadedBy: "John Doe",
  },
  {
    id: "CF002",
    groupId: "CG001",
    name: "Research Data.xlsx",
    size: "4.1 MB",
    date: "Mar 12, 2025",
    uploadedBy: "Jane Smith",
  },
  {
    id: "CF003",
    groupId: "CG001",
    name: "Presentation Slides.pptx",
    size: "8.7 MB",
    date: "Mar 14, 2025",
    uploadedBy: "Michael Brown",
  },
  {
    id: "CF004",
    groupId: "CG001",
    name: "Meeting Notes.pdf",
    size: "1.2 MB",
    date: "Mar 15, 2025",
    uploadedBy: "John Doe",
  },
]

export const mockCollaborationTasks: CollaborationTask[] = [
  {
    id: "CT001",
    groupId: "CG001",
    title: "Research relevant papers",
    description: "Find and summarize at least 5 research papers related to our topic",
    priority: "High",
    dueDate: "Mar 20, 2025",
    status: "To Do",
    assignee: "Jane Smith",
  },
  {
    id: "CT002",
    groupId: "CG001",
    title: "Data collection",
    description: "Gather sample data sets for preliminary analysis",
    priority: "High",
    dueDate: "Mar 18, 2025",
    status: "In Progress",
    assignee: "Michael Brown",
  },
  {
    id: "CT003",
    groupId: "CG001",
    title: "Draft project outline",
    description: "Create a detailed outline for the project report",
    priority: "Medium",
    dueDate: "Mar 22, 2025",
    status: "To Do",
    assignee: "John Doe",
  },
  {
    id: "CT004",
    groupId: "CG001",
    title: "Prepare presentation",
    description: "Create slides for the project presentation",
    priority: "Low",
    dueDate: "Mar 30, 2025",
    status: "To Do",
  },
]

