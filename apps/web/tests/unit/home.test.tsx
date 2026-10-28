import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  it("renders the default scaffold heading", () => {
    render(<Home />);

    expect(
      screen.getByText(/to get started, edit the/i),
    ).toBeInTheDocument();
  });
});
