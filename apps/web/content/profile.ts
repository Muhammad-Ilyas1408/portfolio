import type { ProfileInput } from "./schema";

export const profile: ProfileInput = {
  name: "Muhammad Ilyas",
  title: "AI/ML Engineer",
  headline:
    "AI/ML Engineer | Generative AI & Agentic Systems | LLM Engineering, RAG & FastAPI | Deep Learning & NLP",
  // The owner's own words (pre-M9 polish): the hero's intro paragraph.
  intro:
    "I build practical AI applications with Generative AI, LLMs and agentic systems, including RAG-based solutions, on a strong foundation in Machine Learning and Deep Learning. I also work on the backend, integrating AI into software that solves real-world problems.",
  // Owner-provided in the M5 prompt (self-reported).
  about:
    "My journey into AI started during my Computer Science degree, when I became interested in how machine learning could solve real-world problems. Through hands-on projects and my AI/ML engineering internship, I worked across deep learning, NLP, LLM fine-tuning and privacy-preserving machine learning. What I enjoy most is building practical AI applications — combining Generative AI, RAG and agentic systems with solid backend engineering to turn ideas into useful products. I also enjoy sharing what I learn, which led me to teach two AI bootcamps and lead the Computing Students Society. Next, I want to grow as an AI/ML Engineer in a product-focused team where I can take on real engineering challenges and keep learning.",
  // The owner's own words (pre-M9 polish): shown on /about directly after
  // `about`.
  aboutLeadership:
    "Beyond engineering, I served as President of the Computing Students Society at the University of Peshawar (2025–2026), where our team of around 40 members organized 18 events, and TechRise ’26, a tech conference attended by over 300 people.",
  // Used for page metadata.
  positioning:
    "I build LLM-powered and agentic systems, and I led the Computing Students Society at the University of Peshawar.",
  location: "Pakistan",
  // The owner supplied the file as portrait.jpeg (the M3 prompt said .jpg).
  portrait: { src: "/portrait.jpeg", alt: "Portrait of Muhammad Ilyas" },
  links: {
    email: "mailto:muhammadilyas.ai.eng@gmail.com",
    github: "https://github.com/Muhammad-Ilyas1408",
    linkedin: "https://www.linkedin.com/in/muhammad-ilyas-ds/",
    // Owner-provided (pre-M9 polish): calls and WhatsApp. Shown on /contact
    // only, never in the header, footer, metadata or JSON-LD.
    phone: "tel:+923154710472",
    whatsapp: `https://wa.me/923154710472?text=${encodeURIComponent(
      "Hi Muhammad, I found your portfolio and would like to connect.",
    )}`,
    source: "https://github.com/Muhammad-Ilyas1408/portfolio",
  },
};
