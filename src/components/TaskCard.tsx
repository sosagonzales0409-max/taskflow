import { Calendar, User, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Task, Status } from "../types/task";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
}

const priorityColors: Record<string, string> = {
  baja: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  media: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400",
  alta: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400",
};

const categoryColors: Record<string, string> = {
  Trabajo: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400",
  Personal: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400",
  Salud: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400",
  Estudio: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400",
  Hogar: "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400",
  Finanzas: "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400",
  Social: "bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-400",
};

const statusLabels: Record<string, string> = {
  pendiente: "dashboard.pending",
  en_progreso: "dashboard.inProgress",
  completada: "dashboard.completed",
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">
          {task.title}
        </h3>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ml-2 ${priorityColors[task.priority]}`}
        >
          {task.priority === "alta"
            ? t("filters.high")
            : task.priority === "media"
            ? t("filters.medium")
            : t("filters.low")}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {task.category && (
          <span
            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${categoryColors[task.category] ?? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}
          >
            {task.category}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500 mb-3">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
        {task.assignedTo && (
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {task.assignedTo}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 appearance-none cursor-pointer"
        >
          {Object.entries(statusLabels).map(([value, labelKey]) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </select>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            {t("task.edit")}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-2.5 py-1.5 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
