"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import ProjectTabs from "@/components/ProjectTabs";
import ViewToggle from "@/components/ViewToggle";
import TaskTable from "@/components/TaskTable";
import TaskModal from "@/components/TaskModal";
import { Project, Task } from "@/types";

const GanttChart = dynamic(() => import("@/components/GanttChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-center py-20">
      <div className="text-gray-400 text-sm">Carregando Gantt...</div>
    </div>
  ),
});

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>("");
  const [activeView, setActiveView] = useState<"gantt" | "list">("gantt");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data: Project[] = await res.json();
      setProjects(data);
      if (data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, [activeProjectId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const tasks = activeProject?.tasks || [];

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

  function handleTaskSave(updated: Task) {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== activeProjectId) return p;
        return {
          ...p,
          tasks: p.tasks.map((t) => (t.id === updated.id ? updated : t)),
        };
      })
    );
    setSelectedTask(updated);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Carregando projetos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProjectTabs
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
      />

      {/* Toolbar */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          {activeProject && (
            <p className="text-sm text-gray-500">{activeProject.description}</p>
          )}
        </div>
        <ViewToggle activeView={activeView} onChangeView={setActiveView} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6">
        {activeView === "gantt" ? (
          <GanttChart tasks={tasks} onTaskClick={handleTaskClick} />
        ) : (
          <TaskTable tasks={tasks} onTaskClick={handleTaskClick} />
        )}
      </div>

      {/* Task Modal */}
      {selectedTask && activeProjectId && (
        <TaskModal
          task={selectedTask}
          projectId={activeProjectId}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
}
