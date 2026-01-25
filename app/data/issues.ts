export interface IssueItem {
  id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  type: "Bug" | "Feature" | "Improvement";
  assignee?: string;
  createdAt: Date|string;
  dueDate: Date|string;
  checked: boolean;
}

export const issues: IssueItem[] = [
  {
  id: "1",
  title: "Implement auth",
  description: "Set up OAuth integration with Google and GitHub providers",
  status: "In Progress",
  type: "Feature",
  assignee: "John Doe",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "2",
  title: "Fix dashboard layout bug",
  description: "Dashboard widgets overlap on smaller screens. Adjust CSS grid to resolve.",
  status: "Todo",
  type: "Bug",
  assignee: "Jane Smith",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "3",
  title: "Set up CI/CD pipeline",
  description: "Configure GitHub Actions for automated testing and deployment",
  status: "Done",
  type: "Improvement",
  assignee: "Alex Lee",
  createdAt: new Date(),
  dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  checked: true,
  },
  {
  id: "4",
  title: "Integrate analytics service",
  description: "Add Google Analytics to track user engagement",
  status: "Todo",
  type: "Feature",
  assignee: "Sam Patel",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "5",
  title: "Implement notifications",
  description: "Enable email and in-app notifications for important events",
  status: "In Progress",
  type: "Feature",
  assignee: "Chris Kim",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "6",
  title: "Refactor API endpoints",
  description: "Improve REST API structure and add versioning",
  status: "Todo",
  type: "Improvement",
  assignee: "Morgan Yu",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "7",
  title: "Write unit tests for issues",
  description: "Increase test coverage for all Vue components",
  status: "In Progress",
  type: "Improvement",
  assignee: "Taylor Brooks",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "8",
  title: "Fix memory leak in notifications",
  description: "Notifications panel causes memory usage to spike after repeated use.",
  status: "Todo",
  type: "Bug",
  assignee: "Jordan White",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  checked: false,
  },
  {
  id: "9",
  title: "Add dark mode support",
  description: "Allow users to switch between light and dark themes",
  status: "Done",
  type: "Feature",
  assignee: "Jamie Fox",
  createdAt: new Date(),
  dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  checked: true,
  },
  {
  id: "10",
  title: "Document API endpoints",
  description: "Create OpenAPI (Swagger) documentation for all endpoints",
  status: "Todo",
  type: "Improvement",
  assignee: "Pat Casey",
  createdAt: new Date(),
  dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  checked: false,
  },
];
