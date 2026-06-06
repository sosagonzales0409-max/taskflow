import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Task, TaskFormData } from "../types/task";

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todas");
  const [priorityFilter, setPriorityFilter] = useState<string>("todas");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, "users", userId, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksList);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const addTask = async (data: TaskFormData) => {
    if (!userId) return;
    await addDoc(collection(db, "users", userId, "tasks"), {
      ...data,
      createdAt: serverTimestamp(),
      createdBy: userId,
    });
  };

  const updateTask = async (taskId: string, data: Partial<TaskFormData>) => {
    if (!userId) return;
    await updateDoc(doc(db, "users", userId, "tasks", taskId), data);
  };

  const deleteTask = async (taskId: string) => {
    if (!userId) return;
    await deleteDoc(doc(db, "users", userId, "tasks", taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "todas" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "todas" || task.priority === priorityFilter;
    const matchesCategory =
      categoryFilter === "todas" || task.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return {
    tasks,
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
  };
}
