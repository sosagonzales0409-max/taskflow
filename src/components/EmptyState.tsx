import { ClipboardList, PlayCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Status } from "../types/task";

const config: Record<
  Status,
  { icon: typeof ClipboardList; titleKey: string; descKey: string }
> = {
  pendiente: {
    icon: ClipboardList,
    titleKey: "dashboard.empty.pending",
    descKey: "dashboard.empty.pendingDesc",
  },
  en_progreso: {
    icon: PlayCircle,
    titleKey: "dashboard.empty.inProgress",
    descKey: "dashboard.empty.inProgressDesc",
  },
  completada: {
    icon: CheckCircle2,
    titleKey: "dashboard.empty.completed",
    descKey: "dashboard.empty.completedDesc",
  },
};

export function EmptyState({ status }: { status: Status }) {
  const { t } = useTranslation();
  const { icon: Icon, titleKey, descKey } = config[status];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <p className="text-gray-500 dark:text-gray-400 font-medium text-sm text-center">
        {t(titleKey)}
      </p>
      <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-1 max-w-[200px]">
        {t(descKey)}
      </p>
    </div>
  );
}
