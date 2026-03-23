"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Task } from "@/types";
import { STATUS_COLORS } from "@/lib/constants";

interface GanttChartProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type ViewMode = "Day" | "Week" | "Month";

function normalizeClass(status: string): string {
  return status
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[ãçõé]/g, (c) => {
      const map: Record<string, string> = { ã: "a", ç: "c", õ: "o", é: "e" };
      return map[c] || c;
    });
}

export default function GanttChart({ tasks, onTaskClick }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttRef = useRef<unknown>(null);
  const tasksMapRef = useRef<Map<string, Task>>(new Map());
  const [viewMode, setViewMode] = useState<ViewMode>("Month");

  const handleTaskClick = useCallback(
    (ganttTask: { id: string }) => {
      const task = tasksMapRef.current.get(ganttTask.id);
      if (task) onTaskClick(task);
    },
    [onTaskClick]
  );

  useEffect(() => {
    if (!containerRef.current || tasks.length === 0) return;

    const tasksMap = new Map<string, Task>();
    tasks.forEach((t) => tasksMap.set(t.id, t));
    tasksMapRef.current = tasksMap;

    const ganttTasks = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      start: task.startDate,
      end: task.dueDate,
      progress: task.progress,
      custom_class: `bar-${normalizeClass(task.group)}`,
    }));

    let cancelled = false;

    import("frappe-gantt").then((mod) => {
      if (cancelled) return;
      const Gantt = mod.default;

      containerRef.current!.innerHTML = "";

      const gantt = new Gantt(containerRef.current!, ganttTasks, {
        view_mode: viewMode,
        language: "pt-br",
        popup: false,
        readonly: true,
        today_button: true,
        bar_height: 22,
        padding: 14,
        infinite_padding: false,
        on_click: handleTaskClick,
      });

      ganttRef.current = gantt as never;
    });

    return () => {
      cancelled = true;
    };
  }, [tasks, handleTaskClick, viewMode]);

  // Generate CSS for bar colors per status group
  const barStyles = Object.entries(STATUS_COLORS)
    .map(([status, colors]) => {
      const cls = normalizeClass(status);
      return `
        .bar-wrapper.bar-${cls} .bar { fill: ${colors.bar}; opacity: 0.85; outline-color: ${colors.bar}; }
        .bar-wrapper.bar-${cls} .bar-progress { fill: ${colors.bar}; filter: brightness(0.85); }
        .bar-wrapper.bar-${cls}:hover .bar { opacity: 1; }
        .bar-wrapper.bar-${cls} .bar-label { fill: white !important; font-weight: 500; }
        .bar-wrapper.bar-${cls} .bar-label.big { fill: ${colors.text} !important; }
      `;
    })
    .join("\n");

  const viewModes: { value: ViewMode; label: string }[] = [
    { value: "Day", label: "Dia" },
    { value: "Week", label: "Semana" },
    { value: "Month", label: "Mês" },
  ];

  return (
    <div className="gantt-wrapper bg-white rounded-lg border border-gray-200 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: barStyles }} />

      {/* View mode selector */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {/* Legend - only show statuses used in current tasks */}
          <div className="flex items-center gap-3">
            {Object.entries(STATUS_COLORS)
              .filter(([status]) => tasks.some((t) => t.group === status))
              .map(([status, colors]) => (
              <div key={status} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: colors.bar }}
                />
                <span className="text-xs text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="inline-flex rounded-lg bg-gray-100 p-0.5">
          {viewModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setViewMode(mode.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === mode.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={containerRef} className="gantt-target" />
      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          Nenhuma tarefa encontrada
        </div>
      )}
    </div>
  );
}
