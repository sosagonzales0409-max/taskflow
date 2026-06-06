import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTasks } from "./useTasks";

const mockDocs = [
  { id: "1", data: () => ({ title: "Tarea 1", description: "Desc 1", status: "pendiente", priority: "alta", category: "Trabajo", createdAt: { seconds: 100 }, createdBy: "user1", dueDate: "2026-06-10", assignedTo: "" }) },
  { id: "2", data: () => ({ title: "Tarea 2", description: "Desc 2", status: "en_progreso", priority: "media", category: "Personal", createdAt: { seconds: 200 }, createdBy: "user1", dueDate: "2026-06-15", assignedTo: "" }) },
];

let snapshotCallback: ((snapshot: any) => void) | undefined;

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "tasks"),
  query: vi.fn(() => "q"),
  orderBy: vi.fn(() => "order"),
  onSnapshot: vi.fn((_q: any, cb: any) => {
    snapshotCallback = cb;
    return vi.fn();
  }),
  addDoc: vi.fn(() => Promise.resolve({ id: "3" })),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  doc: vi.fn(() => "docRef"),
  serverTimestamp: vi.fn(() => ({ seconds: 300, nanoseconds: 0 })),
}));

vi.mock("../firebase/config", () => ({
  db: {},
}));

describe("useTasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial loading state", () => {
    const { result } = renderHook(() => useTasks("user1"));
    expect(result.current.loading).toBe(true);
    expect(result.current.tasks).toEqual([]);
  });

  it("should load tasks from onSnapshot", async () => {
    const { result } = renderHook(() => useTasks("user1"));

    act(() => {
      snapshotCallback({
        docs: mockDocs,
      });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe("Tarea 1");
  });

  it("should filter tasks by status", async () => {
    const { result } = renderHook(() => useTasks("user1"));

    act(() => {
      snapshotCallback({ docs: mockDocs });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setStatusFilter("pendiente");
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Tarea 1");
  });

  it("should filter tasks by priority", async () => {
    const { result } = renderHook(() => useTasks("user1"));

    act(() => {
      snapshotCallback({ docs: mockDocs });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setPriorityFilter("alta");
    });

    expect(result.current.filteredTasks).toHaveLength(1);
  });

  it("should filter tasks by search text", async () => {
    const { result } = renderHook(() => useTasks("user1"));

    act(() => {
      snapshotCallback({ docs: mockDocs });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearchText("Tarea 2");
    });

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Tarea 2");
  });

  it("should return all tasks when no filters are set", async () => {
    const { result } = renderHook(() => useTasks("user1"));

    act(() => {
      snapshotCallback({ docs: mockDocs });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.filteredTasks).toHaveLength(2);
  });

  it("should not subscribe when userId is undefined", () => {
    const saved = snapshotCallback;
    snapshotCallback = undefined;
    renderHook(() => useTasks(undefined));
    expect(snapshotCallback).toBeUndefined();
    snapshotCallback = saved;
  });
});
