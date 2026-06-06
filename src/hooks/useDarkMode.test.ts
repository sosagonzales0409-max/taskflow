import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "./useDarkMode";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("useDarkMode", () => {
  it("should default to dark when localStorage theme is dark", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(true);
  });

  it("should default to light when localStorage theme is light", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(false);
  });

  it("should default to system preference when no localStorage", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)" ? true : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useDarkMode());
    expect(result.current.dark).toBe(true);
  });

  it("should toggle dark mode", () => {
    const { result } = renderHook(() => useDarkMode());
    const initial = result.current.dark;

    act(() => {
      result.current.toggle();
    });

    expect(result.current.dark).toBe(!initial);
  });

  it("should add dark class to html element when dark", () => {
    localStorage.setItem("theme", "light");
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should remove dark class from html when not dark", () => {
    localStorage.setItem("theme", "dark");
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("should persist preference to localStorage", () => {
    const { result } = renderHook(() => useDarkMode());

    act(() => {
      result.current.toggle();
    });

    expect(localStorage.getItem("theme")).toBe(
      result.current.dark ? "dark" : "light"
    );
  });
});
