"use client";

import { Project } from "@/types";

interface ProjectTabsProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
}

export default function ProjectTabs({
  projects,
  activeProjectId,
  onSelectProject,
}: ProjectTabsProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 sm:px-6 min-w-max">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => onSelectProject(project.id)}
              className={`relative whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                activeProjectId === project.id
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {project.name}
              {activeProjectId === project.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
