export const STATUS_COLORS: Record<string, { bg: string; text: string; bar: string }> = {
  "FISCALIZAÇÃO": { bg: "#fef2f2", text: "#dc2626", bar: "#ef4444" },
  "EXECUÇÃO": { bg: "#fff7ed", text: "#ea580c", bar: "#f97316" },
  "PILOTO": { bg: "#eff6ff", text: "#2563eb", bar: "#3b82f6" },
  "PLANEJAMENTO": { bg: "#fefce8", text: "#ca8a04", bar: "#eab308" },
  "CONCLUÍDO": { bg: "#f0fdf4", text: "#16a34a", bar: "#22c55e" },
  "EM PROGRESSO": { bg: "#eff6ff", text: "#2563eb", bar: "#3b82f6" },
  "PENDENTE": { bg: "#f3f4f6", text: "#6b7280", bar: "#9ca3af" },
  "NOT STARTED": { bg: "#fff7ed", text: "#ea580c", bar: "#f97316" },
};

export const PRIORITY_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: "urgent", label: "Urgente", color: "#dc2626" },
  { value: "high", label: "Alta", color: "#f97316" },
  { value: "medium", label: "Média", color: "#eab308" },
  { value: "low", label: "Baixa", color: "#3b82f6" },
  { value: "none", label: "Sem prioridade", color: "#9ca3af" },
];

export const DEFAULT_STATUS_OPTIONS = [
  "PLANEJAMENTO",
  "PILOTO",
  "EXECUÇÃO",
  "FISCALIZAÇÃO",
  "CONCLUÍDO",
  "EM PROGRESSO",
  "PENDENTE",
  "NOT STARTED",
];
