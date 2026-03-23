import fs from "fs";
import path from "path";
import { ProjectsData, Project, Task } from "@/types";

const VOLUME_PATH = "/app/data/projects.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "projects.json");
const DATA_PATH = fs.existsSync(path.dirname(VOLUME_PATH)) ? VOLUME_PATH : LOCAL_PATH;

function ensureData(): void {
  if (!fs.existsSync(DATA_PATH)) {
    const seed = fs.readFileSync(LOCAL_PATH, "utf-8");
    fs.writeFileSync(DATA_PATH, seed, "utf-8");
  }
}

export function readData(): ProjectsData {
  ensureData();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeData(data: ProjectsData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function getProjects(): Project[] {
  return readData().projects;
}

export function getProject(projectId: string): Project | undefined {
  return readData().projects.find((p) => p.id === projectId);
}

export function createProject(project: Project): Project {
  const data = readData();
  data.projects.push(project);
  writeData(data);
  return project;
}

export function updateProject(projectId: string, updates: Partial<Project>): Project | null {
  const data = readData();
  const index = data.projects.findIndex((p) => p.id === projectId);
  if (index === -1) return null;
  data.projects[index] = { ...data.projects[index], ...updates };
  writeData(data);
  return data.projects[index];
}

export function deleteProject(projectId: string): boolean {
  const data = readData();
  const index = data.projects.findIndex((p) => p.id === projectId);
  if (index === -1) return false;
  data.projects.splice(index, 1);
  writeData(data);
  return true;
}

export function getTasks(projectId: string): Task[] {
  const project = getProject(projectId);
  return project?.tasks ?? [];
}

export function createTask(projectId: string, task: Task): Task | null {
  const data = readData();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return null;
  project.tasks.push(task);
  writeData(data);
  return task;
}

export function updateTask(projectId: string, taskId: string, updates: Partial<Task>): Task | null {
  const data = readData();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return null;
  const index = project.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return null;
  project.tasks[index] = { ...project.tasks[index], ...updates };
  writeData(data);
  return project.tasks[index];
}

export function deleteTask(projectId: string, taskId: string): boolean {
  const data = readData();
  const project = data.projects.find((p) => p.id === projectId);
  if (!project) return false;
  const index = project.tasks.findIndex((t) => t.id === taskId);
  if (index === -1) return false;
  project.tasks.splice(index, 1);
  writeData(data);
  return true;
}
