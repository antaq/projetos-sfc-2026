export type Priority = "urgent" | "high" | "medium" | "low" | "none";

export interface Task {
  id: string;
  name: string;
  group: string;
  responsible: string[];
  startDate: string;
  dueDate: string;
  priority: Priority;
  status: string;
  comments: string;
  progress: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: Task[];
}

export interface ProjectsData {
  projects: Project[];
}
