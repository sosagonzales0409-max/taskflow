import type { Timestamp } from "firebase/firestore";

export type Priority = "baja" | "media" | "alta";

export type Status = "pendiente" | "en_progreso" | "completada";

export const DEFAULT_CATEGORIES = [
  "Trabajo",
  "Personal",
  "Salud",
  "Estudio",
  "Hogar",
  "Finanzas",
  "Social",
  "Otros",
] as const;

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: string;
  assignedTo: string;
  status: Status;
  createdAt: Timestamp;
  createdBy: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  category: string;
  assignedTo: string;
  status: Status;
}
