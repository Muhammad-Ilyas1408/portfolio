import type { ExplainerInput, PrincipleInput } from "./schema";

// Principle titles are owner-provided (PLAN.md section 5, About). Each links
// to the Flood-Aware case-study section that shows it in practice.
export const principles: PrincipleInput[] = [
  {
    title: "Ground every claim in evidence",
    href: "/projects/flood-aware#citation-validation",
    linkLabel: "Citation validation in Flood-Aware",
  },
  {
    title: "Verify with real systems, not just mocks",
    href: "/projects/flood-aware#golden-set",
    linkLabel: "Golden-set evaluation in Flood-Aware",
  },
  {
    title: "Fix root causes, not symptoms",
    href: "/projects/flood-aware#hard-problems",
    linkLabel: "Hard problems solved in Flood-Aware",
  },
];

// A general explanation of the technique (Abadi et al., 2016), not a claim
// about any result from the internship.
export const dpSgdExplainer: ExplainerInput = {
  title: "DP-SGD in three sentences",
  sentences: [
    "DP-SGD (differentially private stochastic gradient descent) trains a model so that what it learns reveals very little about any single training example.",
    "At every step it clips each example's gradient to a fixed maximum size, so no one example can move the model too far, and then adds random Gaussian noise to the combined gradient before updating the weights.",
    "A privacy accountant tracks the total privacy budget (ε) spent over training: more noise gives a stronger guarantee but usually costs accuracy and training stability.",
  ],
};
