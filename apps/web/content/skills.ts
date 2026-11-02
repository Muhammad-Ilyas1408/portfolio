import type { SkillGroupInput } from "./schema";

export const skills: SkillGroupInput[] = [
  {
    name: "ML/DL",
    skills: [
      { name: "Python", usedIn: ["flood-aware"] },
      { name: "SQL", usedIn: [] },
      { name: "NumPy", usedIn: [] },
      { name: "Pandas", usedIn: [] },
      { name: "Scikit-learn", usedIn: [] },
      { name: "TensorFlow", usedIn: [] },
      { name: "PyTorch", usedIn: [] },
      { name: "NLP", usedIn: [] },
    ],
  },
  {
    name: "GenAI & LLMs",
    skills: [
      { name: "Hugging Face", usedIn: [] },
      { name: "LangChain", usedIn: ["flood-aware"] },
      { name: "LangGraph", usedIn: ["flood-aware"] },
      { name: "RAG", usedIn: ["flood-aware"] },
      { name: "Agentic AI", usedIn: ["flood-aware"] },
      { name: "LLM fine-tuning", usedIn: ["internship"] },
      { name: "LoRA/QLoRA", usedIn: ["internship"] },
    ],
  },
  {
    name: "Backend",
    skills: [
      { name: "FastAPI", usedIn: ["flood-aware"] },
      { name: "Pydantic", usedIn: ["flood-aware"] },
      { name: "Streamlit", usedIn: [] },
    ],
  },
  {
    name: "Frontend",
    skills: [
      { name: "Next.js", usedIn: ["flood-aware"] },
      { name: "TypeScript", usedIn: ["flood-aware"] },
      { name: "Tailwind CSS", usedIn: ["flood-aware"] },
    ],
  },
  {
    name: "Data & vector stores",
    skills: [
      { name: "PostgreSQL", usedIn: [] },
      { name: "SQLite", usedIn: [] },
      { name: "FAISS", usedIn: [] },
      { name: "ChromaDB", usedIn: ["flood-aware"] },
    ],
  },
  {
    name: "Tools & platforms",
    skills: [
      { name: "Git/GitHub", usedIn: [] },
      { name: "Jupyter", usedIn: [] },
      { name: "Google Colab", usedIn: [] },
      { name: "Railway", usedIn: ["flood-aware"] },
      { name: "Vercel", usedIn: ["flood-aware"] },
    ],
  },
];
