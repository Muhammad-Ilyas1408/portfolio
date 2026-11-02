import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders an anchor when given href", () => {
    render(<Button href="/projects">Work</Button>);

    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a button without href", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
