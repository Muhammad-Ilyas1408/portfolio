import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("renders the name and positioning line", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Muhammad Ilyas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "AI/ML Engineer building grounded, agentic systems — and the communities that build them.",
      ),
    ).toBeInTheDocument();
  });
});
