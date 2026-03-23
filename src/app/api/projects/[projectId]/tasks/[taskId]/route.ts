import { NextResponse } from "next/server";
import { updateTask, deleteTask, getTasks } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const { projectId, taskId } = await params;
  const tasks = getTasks(projectId);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const { projectId, taskId } = await params;
  const body = await request.json();
  const updated = updateTask(projectId, taskId, body);
  if (!updated) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const { projectId, taskId } = await params;
  const deleted = deleteTask(projectId, taskId);
  if (!deleted) return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
  return NextResponse.json({ success: true });
}
