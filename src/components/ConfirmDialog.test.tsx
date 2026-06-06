import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "es" },
  }),
}));

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    title: "Eliminar tarea",
    description: "Esta acción no se puede deshacer",
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it("should render nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("should render title and description when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Eliminar tarea")).toBeInTheDocument();
    expect(
      screen.getByText("Esta acción no se puede deshacer")
    ).toBeInTheDocument();
  });

  it("should call onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog {...defaultProps} onConfirm={onConfirm} />
    );
    const confirmBtn = screen.getByText("nav.confirm");
    fireEvent.click(confirmBtn);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    const cancelBtn = screen.getByText("nav.cancel");
    fireEvent.click(cancelBtn);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when close icon is clicked", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    const closeBtn = screen.getByRole("button", { name: "" });
    if (closeBtn) {
      fireEvent.click(closeBtn);
    } else {
      const allButtons = screen.getAllByRole("button");
      const xButton = allButtons.find(
        (b) => b.querySelector("svg") && !b.textContent
      );
      if (xButton) fireEvent.click(xButton);
    }
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should use custom button labels when provided", () => {
    render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Sí, eliminar"
        cancelLabel="No, cancelar"
      />
    );
    expect(screen.getByText("Sí, eliminar")).toBeInTheDocument();
    expect(screen.getByText("No, cancelar")).toBeInTheDocument();
  });

  it("should apply destructive styles when destructive prop is true", () => {
    render(<ConfirmDialog {...defaultProps} destructive />);
    const confirmBtn = screen.getByText("nav.confirm");
    expect(confirmBtn.classList.contains("bg-red-600")).toBe(true);
  });
});
