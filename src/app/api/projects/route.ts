import { NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/data";
import { Project } from "@/types";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const project: Project = {
    id: body.id || crypto.randomUUID(),
    name: body.name,
    description: body.description || "",
    createdAt: new Date().toISOString().split("T")[0],
    tasks: body.tasks || [],
  };
  const created = createProject(project);
  return NextResponse.json(created, { status: 201 });
}
