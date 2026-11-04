import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  EvidenceChip,
  evidenceChipName,
} from "@/components/evidence/EvidenceChip";

const props = {
  kind: "repo",
  label: "Sample",
  url: "https://example.com/proof",
} as const;

describe("EvidenceChip", () => {
  it("links to the evidence and opens externally", () => {
    render(<EvidenceChip {...props} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", props.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows only the kind, and its name is '<KIND>: <label> (opens in a new tab)'", () => {
    render(<EvidenceChip {...props} />);

    const link = screen.getByRole("link", {
      name: "REPO: Sample (opens in a new tab)",
    });
    expect(link).toHaveTextContent(/^repo$/);
    expect(screen.queryByText("Sample")).not.toBeInTheDocument();
  });

  it("shows the verified dot only when verified", () => {
    const { rerender } = render(<EvidenceChip {...props} />);
    expect(screen.getByRole("link")).not.toHaveAttribute("data-verified");
    expect(screen.getByRole("link").querySelector(".bg-verified")).toBeNull();

    rerender(<EvidenceChip {...props} verified />);
    expect(screen.getByRole("link")).toHaveAttribute("data-verified", "true");
    expect(
      screen.getByRole("link").querySelector(".bg-verified"),
    ).not.toBeNull();
  });

  it("always starts the accessible name with the visible kind", () => {
    expect(evidenceChipName("repo", "README")).toBe(
      "REPO: README (opens in a new tab)",
    );
    expect(evidenceChipName("changelog", "Hotfix 14.4")).toBe(
      "CHANGELOG: Hotfix 14.4 (opens in a new tab)",
    );

    render(<EvidenceChip kind="devpost" label="Anything" url={props.url} />);
    const link = screen.getByRole("link");
    const visible = link.textContent ?? "";
    expect(
      link.getAttribute("aria-label")?.startsWith(visible.toUpperCase()),
    ).toBe(true);
  });
});
