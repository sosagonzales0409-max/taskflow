import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import { Navbar } from "../components/Navbar";
import { TaskCard } from "../components/TaskCard";
import { TaskForm } from "../components/TaskForm";
import { Filters } from "../components/Filters";
import { EmptyState } from "../components/EmptyState";
import { Skeleton } from "../components/Skeleton";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Task, TaskFormData, Status } from "../types/task";
import { DEFAULT_CATEGORIES } from "../types/task";

const columns: { key: Status; labelKey: string }[] = [
  { key: "pendiente", labelKey: "dashboard.pending" },
  { key: "en_progreso", labelKey: "dashboard.inProgress" },
  { key: "completada", labelKey: "dashboard.completed" },
];

const columnColors: Record<Status, string> = {
  pendiente: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  en_progreso: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  completada: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
};

const columnHeaders: Record<Status, string> = {
  pendiente: "bg-amber-100 dark:bg-amber-800/40 text-amber-800 dark:text-amber-300",
  en_progreso: "bg-blue-100 dark:bg-blue-800/40 text-blue-800 dark:text-blue-300",
  completada: "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-800 dark:text-emerald-300",
};

function loadCustomCategories(): string[] {
  try {
    const stored = localStorage.getItem("customCategories");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const {
    filteredTasks,
    loading,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    addTask,
    updateTask,
    deleteTask,
  } = useTasks(user?.uid);

  const [customCategories, setCustomCategories] = useState<string[]>(loadCustomCategories);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];

  const handleAddCategory = useCallback((name: string) => {
    if (allCategories.includes(name)) return;
    const updated = [...customCategories, name];
    setCustomCategories(updated);
    localStorage.setItem("customCategories", JSON.stringify(updated));
  }, [customCategories, allCategories]);

  const handleSubmit = async (data: TaskFormData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success(t("task.updated"), { description: t("task.updatedDesc") });
      } else {
        await addTask(data);
        toast.success(t("task.created"), { description: t("task.createdDesc") });
      }
      setShowForm(false);
      setEditingTask(null);
    } catch {
      toast.error(t("task.error"), { description: t("task.errorDesc") });
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = async (taskId: string, status: Status) => {
    try {
      await updateTask(taskId, { status });
    } catch {
      toast.error(t("task.error"), { description: t("task.errorDesc") });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTaskId) return;
    try {
      await deleteTask(deletingTaskId);
      toast.success(t("task.deleted"), { description: t("task.deletedDesc") });
    } catch {
      toast.error(t("task.error"), { description: t("task.errorDesc") });
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getColumnTasks = (status: Status) =>
    filteredTasks.filter((task) => task.status === status);

  const showSingleColumn = statusFilter !== "todas";
  const columnsToRender = showSingleColumn
    ? columns.filter((c) => c.key === statusFilter)
    : columns;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.title")}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("dashboard.newTask")}
          </button>
        </div>

        <Filters
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={allCategories}
        />

        {loading ? (
          <div className={`grid grid-cols-1 ${showSingleColumn ? "" : "md:grid-cols-3"} gap-6 items-start`}>
            {columnsToRender.map((col) => (
              <div key={col.key}>
                <Skeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${showSingleColumn ? "" : "md:grid-cols-3"} gap-6 items-start`}>
            {columnsToRender.map((col) => {
              const colTasks = getColumnTasks(col.key);
              return (
                <div
                  key={col.key}
                  className={`rounded-xl border ${columnColors[col.key]} p-4`}
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${columnHeaders[col.key]}`}>
                    {t(col.labelKey)}
                    <span className="ml-1.5 opacity-70">({colTasks.length})</span>
                  </div>

                  <div className="space-y-3">
                    {colTasks.length === 0 ? (
                      <EmptyState status={col.key} />
                    ) : (
                      colTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEdit}
                          onDelete={(id) => setDeletingTaskId(id)}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          categories={allCategories}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          onAddCategory={handleAddCategory}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingTaskId}
        title={t("confirm.deleteTask")}
        description={t("confirm.deleteTaskDesc")}
        confirmLabel={t("confirm.delete")}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTaskId(null)}
        destructive
      />
    </div>
  );
}
