"use client";

import { useState } from "react";
import { Task, Priority } from "@/types";
import StatusBadge from "./StatusBadge";
import { PRIORITY_OPTIONS, DEFAULT_STATUS_OPTIONS } from "@/lib/constants";

interface TaskModalProps {
  task: Task;
  projectId: string;
  onClose: () => void;
  onSave: (updated: Task) => void;
}

export default function TaskModal({ task, projectId, onClose, onSave }: TaskModalProps) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Task>({ ...task });
  const [saving, setSaving] = useState(false);
  const [responsibleInput, setResponsibleInput] = useState("");

  function formatDate(dateStr: string): string {
    if (!dateStr) return "-";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  function addResponsible() {
    const name = responsibleInput.trim();
    if (name && !form.responsible.includes(name)) {
      setForm({ ...form, responsible: [...form.responsible, name] });
      setResponsibleInput("");
    }
  }

  function removeResponsible(name: string) {
    setForm({ ...form, responsible: form.responsible.filter((r) => r !== name) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {editing ? "Editar Tarefa" : "Detalhes da Tarefa"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nome</label>
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-sm font-medium text-gray-900">{task.name}</p>
            )}
          </div>

          {/* Grupo & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Grupo</label>
              {editing ? (
                <select
                  value={form.group}
                  onChange={(e) => setForm({ ...form, group: e.target.value, status: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEFAULT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <StatusBadge status={task.group} size="md" />
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              {editing ? (
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {DEFAULT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              ) : (
                <StatusBadge status={task.status} size="md" />
              )}
            </div>
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {(editing ? form.responsible : task.responsible).map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700"
                >
                  {r}
                  {editing && (
                    <button
                      onClick={() => removeResponsible(r)}
                      className="hover:text-red-500 ml-0.5"
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))}
              {!editing && task.responsible.length === 0 && (
                <span className="text-sm text-gray-400">-</span>
              )}
            </div>
            {editing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={responsibleInput}
                  onChange={(e) => setResponsibleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addResponsible())}
                  placeholder="Adicionar responsável..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addResponsible}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data de Início</label>
              {editing ? (
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-700">{formatDate(task.startDate)}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Data de Vencimento</label>
              {editing ? (
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-700">{formatDate(task.dueDate)}</p>
              )}
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
            {editing ? (
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-700">
                {PRIORITY_OPTIONS.find((p) => p.value === task.priority)?.label || "-"}
              </p>
            )}
          </div>

          {/* Progresso */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Progresso</label>
            {editing ? (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.progress}
                  onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-sm text-gray-700 w-10 text-right">{form.progress}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{task.progress}%</span>
              </div>
            )}
          </div>

          {/* Comentários */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Comentários</label>
            {editing ? (
              <textarea
                value={form.comments}
                onChange={(e) => setForm({ ...form, comments: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Adicionar comentário..."
              />
            ) : (
              <p className="text-sm text-gray-700">{task.comments || "-"}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-gray-100">
          {editing ? (
            <>
              <button
                onClick={() => { setForm({ ...task }); setEditing(false); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
