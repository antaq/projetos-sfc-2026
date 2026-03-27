"use client";

import { Task } from "@/types";
import StatusBadge from "./StatusBadge";
import { STATUS_COLORS, PRIORITY_OPTIONS } from "@/lib/constants";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskTable({ tasks, onTaskClick }: TaskTableProps) {
  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.group]) acc[task.group] = [];
    acc[task.group].push(task);
    return acc;
  }, {});

  const groupOrder = ["FISCALIZAÇÃO", "EXECUÇÃO", "PILOTO", "PLANEJAMENTO", "CONCLUÍDO"];
  const sortedGroups = Object.keys(grouped).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );

  function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  function getPriorityLabel(value: string): string {
    return PRIORITY_OPTIONS.find((p) => p.value === value)?.label || "-";
  }

  function getPriorityColor(value: string): string {
    return PRIORITY_OPTIONS.find((p) => p.value === value)?.color || "#9ca3af";
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {sortedGroups.map((group) => {
        const colors = STATUS_COLORS[group] || { bg: "#f3f4f6", text: "#6b7280" };
        const groupTasks = grouped[group];

        return (
          <div key={group}>
            {/* Group header - always full width, not scrollable */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100"
              style={{ backgroundColor: colors.bg }}
            >
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{ backgroundColor: colors.text }}
              >
                {group}
              </span>
              <span className="text-xs text-gray-500">{groupTasks.length}</span>
            </div>

            {/* Scrollable table area */}
            <div className="overflow-x-auto">
              {/* Table header */}
              <div className="grid grid-cols-[minmax(140px,1fr)_130px_100px_110px_100px] min-w-[580px] gap-2 px-4 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 bg-gray-50">
                <span>Nome</span>
                <span>Responsável</span>
                <span>Vencimento</span>
                <span>Prioridade</span>
                <span>Status</span>
              </div>

              {/* Task rows */}
              {groupTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="grid grid-cols-[minmax(140px,1fr)_130px_100px_110px_100px] min-w-[580px] gap-2 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors items-center"
                >
                  <span className="text-sm text-gray-900 font-medium truncate">
                    {task.name}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {task.responsible.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    {formatDate(task.dueDate)}
                  </span>
                  <div>
                    {task.priority !== "none" ? (
                      <span className="flex items-center gap-1 text-xs">
                        <svg
                          className="h-3 w-3"
                          fill={getPriorityColor(task.priority)}
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 6l3-3h8l3 3v8l-3 3H6l-3-3V6z" />
                        </svg>
                        {getPriorityLabel(task.priority)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                  <StatusBadge status={task.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {tasks.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          Nenhuma tarefa encontrada
        </div>
      )}
    </div>
  );
}
