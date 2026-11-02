import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EvidenceChip } from "@/components/evidence/EvidenceChip";

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

  it("shows Verified text only when verified", () => {
    const { rerender } = render(<EvidenceChip {...props} />);
    expect(screen.queryByText("Verified")).not.toBeInTheDocument();

    rerender(<EvidenceChip {...props} verified />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });
});
