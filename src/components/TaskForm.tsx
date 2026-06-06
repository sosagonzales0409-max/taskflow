import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Task, TaskFormData } from "../types/task";

interface TaskFormProps {
  task?: Task | null;
  categories: string[];
  onSubmit: (data: TaskFormData) => void;
  onClose: () => void;
  onAddCategory: (name: string) => void;
}

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  dueDate: "",
  priority: "media",
  category: "",
  assignedTo: "",
  status: "pendiente",
};

export function TaskForm({ task, categories, onSubmit, onClose, onAddCategory }: TaskFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<TaskFormData>(
    task
      ? {
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          priority: task.priority,
          category: task.category,
          assignedTo: task.assignedTo,
          status: task.status,
        }
      : emptyForm
  );
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCategory = () => {
    const name = newCategory.trim();
    if (!name) return;
    onAddCategory(name);
    setForm({ ...form, category: name });
    setNewCategory("");
    setShowNewCategory(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 pb-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {task ? t("task.editTitle") : t("task.newTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("task.title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
              placeholder={t("task.titlePlaceholder")}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("task.description")}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition resize-none"
              placeholder={t("task.descriptionPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("task.dueDate")}
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("task.priority")}
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
              >
                <option value="baja">{t("task.priorityLow")}</option>
                <option value="media">{t("task.priorityMedium")}</option>
                <option value="alta">{t("task.priorityHigh")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={showNewCategory ? "col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("task.category")}
              </label>
              {!showNewCategory ? (
                <select
                  name="category"
                  value={form.category}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setShowNewCategory(true);
                    } else {
                      setForm({ ...form, category: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                >
                  <option value="">{t("task.categoryPlaceholder")}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="__new__">+ {t("filters.newCategory")}</option>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder={t("filters.newCategory")}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition cursor-pointer whitespace-nowrap"
                  >
                    {t("filters.addCategory")}
                  </button>
                </div>
              )}
            </div>
            {!showNewCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("task.assignedTo")}
                </label>
                <input
                  type="text"
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition"
                  placeholder={t("task.assignedToPlaceholder")}
                />
              </div>
            )}
          </div>

          {task && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("task.status")}
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
              >
                <option value="pendiente">{t("dashboard.pending")}</option>
                <option value="en_progreso">{t("dashboard.inProgress")}</option>
                <option value="completada">{t("dashboard.completed")}</option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition cursor-pointer"
            >
              {t("task.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition cursor-pointer shadow-sm"
            >
              {task ? t("task.save") : t("task.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
