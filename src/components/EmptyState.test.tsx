import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "es" },
  }),
}));

describe("EmptyState", () => {
  it("should render pending state with correct text", () => {
    render(<EmptyState status="pendiente" />);
    expect(screen.getByText("dashboard.empty.pending")).toBeInTheDocument();
    expect(
      screen.getByText("dashboard.empty.pendingDesc")
    ).toBeInTheDocument();
  });

  it("should render in progress state with correct text", () => {
    render(<EmptyState status="en_progreso" />);
    expect(
      screen.getByText("dashboard.empty.inProgress")
    ).toBeInTheDocument();
    expect(
      screen.getByText("dashboard.empty.inProgressDesc")
    ).toBeInTheDocument();
  });

  it("should render completed state with correct text", () => {
    render(<EmptyState status="completada" />);
    expect(
      screen.getByText("dashboard.empty.completed")
    ).toBeInTheDocument();
    expect(
      screen.getByText("dashboard.empty.completedDesc")
    ).toBeInTheDocument();
  });

  it("should render an icon for each status", () => {
    const { container } = render(<EmptyState status="pendiente" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
