import { NextResponse } from "next/server";
import { getProject, updateProject, deleteProject } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const project = getProject(projectId);
  if (!project) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const body = await request.json();
  const updated = updateProject(projectId, body);
  if (!updated) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const deleted = deleteProject(projectId);
  if (!deleted) return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  return NextResponse.json({ success: true });
}
