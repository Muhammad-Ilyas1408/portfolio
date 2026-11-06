import type { ProfileInput } from "./schema";

export const profile: ProfileInput = {
  name: "Muhammad Ilyas",
  title: "AI/ML Engineer",
  headline:
    "AI/ML Engineer | Generative AI & Agentic Systems | LLM Engineering, RAG & FastAPI | Deep Learning & NLP",
  intro:
    "I fine-tune LLMs and build grounded, RAG-powered applications with LangGraph, FastAPI and Next.js — and I led the University of Peshawar's Computing Students Society as President (2025–26).",
  // Owner-provided in the M5 prompt (self-reported).
  about:
    "My journey into AI started during my Computer Science degree, when I became interested in how machine learning could solve real-world problems. Through hands-on projects and my AI/ML engineering internship, I worked across deep learning, NLP, LLM fine-tuning and privacy-preserving machine learning. What I enjoy most is building practical AI applications — combining Generative AI, RAG and agentic systems with solid backend engineering to turn ideas into useful products. I also enjoy sharing what I learn, which led me to teach two AI bootcamps and lead the Computing Students Society. Next, I want to grow as an AI/ML Engineer in a product-focused team where I can take on real engineering challenges and keep learning.",
  // Used for page metadata.
  positioning:
    "AI/ML Engineer building grounded, agentic systems — and the communities that build them.",
  location: "Pakistan",
  // The owner supplied the file as portrait.jpeg (the M3 prompt said .jpg).
  portrait: { src: "/portrait.jpeg", alt: "Portrait of Muhammad Ilyas" },
  links: {
    email: "mailto:muhammadilyas.ai.eng@gmail.com",
    github: "https://github.com/Muhammad-Ilyas1408",
    linkedin: "https://www.linkedin.com/in/muhammad-ilyas-ds/",
    source: "https://github.com/Muhammad-Ilyas1408/portfolio",
  },
};
