import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    register: mockRegister,
    logout: vi.fn(),
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "es" },
  }),
}));

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form by default", () => {
    render(<Login />);
    expect(screen.getByText("auth.loginTitle")).toBeInTheDocument();
  });

  it("should switch to register mode", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("auth.registerLink"));
    expect(screen.getByText("auth.registerTitle")).toBeInTheDocument();
  });

  it("should call login on form submit", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("auth.emailPlaceholder"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.passwordPlaceholder"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("auth.login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
    });
  });

  it("should call register on form submit in register mode", async () => {
    mockRegister.mockResolvedValue(undefined);
    render(<Login />);

    fireEvent.click(screen.getByText("auth.registerLink"));

    fireEvent.change(screen.getByPlaceholderText("auth.emailPlaceholder"), {
      target: { value: "nuevo@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.passwordPlaceholder"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("auth.register"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("nuevo@test.com", "password123");
    });
  });

  it("should show error message on login failure", async () => {
    mockLogin.mockRejectedValue(new Error("(auth/invalid-credential)"));
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("auth.emailPlaceholder"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.passwordPlaceholder"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByText("auth.login"));

    await waitFor(() => {
      expect(screen.getByText("auth.error.invalidCredential")).toBeInTheDocument();
    });
  });

  it("should navigate to / on successful login", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("auth.emailPlaceholder"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("auth.passwordPlaceholder"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByText("auth.login"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
