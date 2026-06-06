import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("should render 3 placeholder cards", () => {
    const { container } = render(<Skeleton />);
    const cards = container.querySelectorAll(".animate-pulse > div");
    expect(cards).toHaveLength(3);
  });

  it("should have animate-pulse class", () => {
    const { container } = render(<Skeleton />);
    const wrapper = container.querySelector(".animate-pulse");
    expect(wrapper).toBeInTheDocument();
  });

  it("should render skeleton bars inside each card", () => {
    const { container } = render(<Skeleton />);
    const bars = container.querySelectorAll(".bg-gray-200");
    expect(bars.length).toBeGreaterThan(0);
  });
});
