import { NextResponse } from "next/server";
import { getTasks, createTask } from "@/lib/data";
import { Task } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const tasks = getTasks(projectId);
  return NextResponse.json(tasks);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const task: Task = {
    id: body.id || crypto.randomUUID(),
    name: body.name,
    group: body.group || "PLANEJAMENTO",
    responsible: body.responsible || [],
    startDate: body.startDate,
    dueDate: body.dueDate,
    priority: body.priority || "none",
    status: body.status || body.group || "PLANEJAMENTO",
    comments: body.comments || "",
    progress: body.progress || 0,
  };
  const created = createTask(projectId, task);
  if (!created) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}
