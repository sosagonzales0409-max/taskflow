import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "./TaskCard";
import type { Task } from "../types/task";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "es" },
  }),
}));

const baseTask: Task = {
  id: "1",
  title: "Comprar pan",
  description: "Ir al supermercado",
  dueDate: "2026-06-10",
  priority: "alta",
  category: "Hogar",
  assignedTo: "Juan",
  status: "pendiente",
  createdAt: { seconds: 1000, nanoseconds: 0 } as any,
  createdBy: "user123",
};

describe("TaskCard", () => {
  it("should render task title and description", () => {
    render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.getByText("Comprar pan")).toBeInTheDocument();
    expect(screen.getByText("Ir al supermercado")).toBeInTheDocument();
  });

  it("should render priority badge", () => {
    render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.getByText("filters.high")).toBeInTheDocument();
  });

  it("should render category badge when category exists", () => {
    render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.getByText("Hogar")).toBeInTheDocument();
  });

  it("should not render description when empty", () => {
    render(
      <TaskCard
        task={{ ...baseTask, description: "" }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    expect(
      document.querySelector(".line-clamp-2")
    ).not.toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", () => {
    const onEdit = vi.fn();
    render(
      <TaskCard
        task={baseTask}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("task.edit"));
    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it("should call onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onStatusChange={vi.fn()}
      />
    );
    const allButtons = screen.getAllByRole("button");
    const deleteBtn = allButtons.find(
      (b) => b.classList.contains("bg-red-50")
    );
    expect(deleteBtn).toBeDefined();
    fireEvent.click(deleteBtn!);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("should call onStatusChange when status select changes", () => {
    const onStatusChange = vi.fn();
    const { container } = render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={onStatusChange}
      />
    );
    const select = container.querySelector("select")!;
    fireEvent.change(select, { target: { value: "completada" } });
    expect(onStatusChange).toHaveBeenCalledWith("1", "completada");
  });

  it("should render assigned to when provided", () => {
    render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    expect(screen.getByText("Juan")).toBeInTheDocument();
  });

  it("should render due date when provided", () => {
    const { container } = render(
      <TaskCard
        task={baseTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );
    const dueDateEl = container.querySelector(".lucide-calendar")
      ?.closest("span");
    expect(dueDateEl).toBeInTheDocument();
    expect(dueDateEl?.textContent).toMatch(/2026/);
  });
});
