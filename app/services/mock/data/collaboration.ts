// Mock data for collaboration features
// Mock data for collaboration features
export const mockCollaborationGroups = [
  {
    id: "CG001",
    name: "BEng Software Engineering - Project Group",
    description: "Group for Software Engineering final year project collaboration",
    department: "School of Computing",
    members: [
      {
        id: "M001",
        name: "Kavindu Perera",
        role: "Group Leader",
        email: "kavindu.perera@esoft.lk",
        department: "School of Computing",
      },
      {
        id: "M002",
        name: "Dilini Gamage",
        role: "Member",
        email: "dilini.gamage@esoft.lk",
        department: "School of Computing",
      },
      {
        id: "M003",
        name: "Kasun Wijesinghe",
        role: "Member",
        email: "kasun.wijesinghe@esoft.lk",
        department: "School of Computing",
      },
    ],
  },
  {
    id: "CG002",
    name: "Civil Engineering - Research Team",
    description: "Research collaboration for Civil Engineering department",
    department: "School of Engineering",
    members: [
      {
        id: "M004",
        name: "Tharushi Weerasinghe",
        role: "Group Leader",
        email: "tharushi.weerasinghe@esoft.lk",
        department: "School of Engineering",
      },
      {
        id: "M005",
        name: "Nuwan Silva",
        role: "Member",
        email: "nuwan.silva@esoft.lk",
        department: "School of Engineering",
      },
    ],
  },
  {
    id: "CG003",
    name: "Marketing Strategy Team",
    description: "Collaboration group for Business Management students",
    department: "School of Management & Law",
    members: [
      {
        id: "M006",
        name: "Sanduni Fernando",
        role: "Group Leader",
        email: "sanduni.fernando@esoft.lk",
        department: "School of Management & Law",
      },
      {
        id: "M007",
        name: "Supun Ratnayake",
        role: "Member",
        email: "supun.ratnayake@esoft.lk",
        department: "School of Management & Law",
      },
      {
        id: "M008",
        name: "Pavithra Senanayake",
        role: "Member",
        email: "pavithra.senanayake@esoft.lk",
        department: "School of Management & Law",
      },
    ],
  },
];

// Simple array of messages for each group
export const mockCollaborationMessages = [
  {
    id: "MSG001",
    groupId: "CG001",
    sender: "Kavindu Perera",
    time: "10:30 AM",
    content: "Has everyone started on their part of the project?",
  },
  {
    id: "MSG002",
    groupId: "CG001",
    sender: "Dilini Gamage",
    time: "10:35 AM",
    content: "Yes, I've completed the initial research and will share my findings soon.",
  },
  {
    id: "MSG003",
    groupId: "CG001",
    sender: "Kasun Wijesinghe",
    time: "10:40 AM",
    content: "I'm still working on the data analysis section. Should be done by tomorrow.",
  },
  {
    id: "MSG007",
    groupId: "CG002",
    sender: "Tharushi Weerasinghe",
    time: "9:00 AM",
    content: "Team, I've uploaded the research papers we need to review for our project.",
  },
  {
    id: "MSG008",
    groupId: "CG002",
    sender: "Nuwan Silva",
    time: "9:15 AM",
    content: "Thanks Tharushi. I'll start reviewing them today.",
  },
  {
    id: "MSG009",
    groupId: "CG003",
    sender: "Sanduni Fernando",
    time: "11:30 AM",
    content: "Hello team! I've created a shared document for our marketing strategy project.",
  },
];

// Files shared in each group
export const mockCollaborationFiles = [
  {
    id: "F001",
    groupId: "CG001",
    name: "Project Proposal.pdf",
    size: "2.4 MB",
    date: "2023-09-15",
  },
  {
    id: "F005",
    groupId: "CG002",
    name: "Research Paper - Structural Engineering.pdf",
    size: "4.5 MB",
    date: "2023-09-10",
  },
  {
    id: "F008",
    groupId: "CG003",
    name: "Marketing Strategy Plan.pptx",
    size: "5.6 MB",
    date: "2023-09-14",
  },
];

// Tasks for each group
export const mockCollaborationTasks = [
  {
    id: "T001",
    groupId: "CG001",
    title: "Complete Literature Review",
    description: "Review at least 10 academic papers related to the topic",
    priority: "High",
    dueDate: "2023-10-05",
    status: "In Progress",
    assignee: "Dilini Gamage",
  },
  {
    id: "T002",
    groupId: "CG001",
    title: "Prepare Presentation Slides",
    description: "Create slides for the final presentation",
    priority: "Medium",
    dueDate: "2023-10-10",
    status: "To Do",
    assignee: "Kavindu Perera",
  },
  {
    id: "T005",
    groupId: "CG002",
    title: "Review Research Papers",
    description: "Read and summarize the assigned research papers",
    priority: "High",
    dueDate: "2023-09-30",
    status: "In Progress",
    assignee: "Nuwan Silva",
  },
  {
    id: "T007",
    groupId: "CG003",
    title: "Conduct Market Analysis",
    description: "Analyze the current market trends and opportunities",
    priority: "High",
    dueDate: "2023-09-28",
    status: "In Progress",
    assignee: "Supun Ratnayake",
  },
];

