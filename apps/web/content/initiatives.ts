import type { ClaimInput, InitiativeInput } from "./schema";

// Every figure here is self-reported by the owner.
const selfReported = (text: string): ClaimInput => ({
  text,
  status: "self-reported",
});

const asPresident = "Organized as CSS President";

export const initiatives: InitiativeInput[] = [
  {
    name: "Supabase Meetup Peshawar",
    start: "2025-11-13",
    format: "on-campus",
    focus: "technical",
    myRole: asPresident,
    summary:
      "Co-hosted with Supabase Peshawar, with TechKhwa as community partner: panel talks, technical sessions and live demos.",
    stats: [selfReported("100+ attendees")],
    featured: false,
    photos: [
      {
        src: "/images/events/supabase-meetup/talk.jpg",
        alt: "Talk on stage at the Supabase Meetup Peshawar",
      },
      {
        src: "/images/events/supabase-meetup/audience.jpg",
        alt: "Students in the audience at the Supabase Meetup Peshawar",
      },
    ],
    published: true,
  },
  {
    name: "Sports Fest 2025–26",
    start: "2025-11-23",
    end: "2025-11-28",
    format: "on-campus",
    focus: "community",
    myRole: "Chief organizer (as CSS President)",
    summary:
      "A six-day festival of cricket, futsal, badminton, traditional Pashto games, chess and e-sports.",
    stats: [selfReported("700+ participants")],
    featured: false,
    // The owner confirmed teams.png is correct (the prompt listed teams.jpg).
    photos: [
      {
        src: "/images/events/sports-fest/teams.png",
        alt: "Teams lined up on the ground at Sports Fest 2025–26",
      },
      {
        src: "/images/events/sports-fest/trophies.jpg",
        alt: "Guests and organizers with the championship trophies at Sports Fest 2025–26",
      },
    ],
    published: true,
  },
  {
    name: "Web Development: What to Learn, When, Why",
    start: "2025-12-29",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("100+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Your 1st Step into AI",
    start: "2026-01-03",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("60+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Workflow Automation with n8n (2 days)",
    start: "2026-01-24",
    end: "2026-01-25",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("50+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Build Your First Website",
    start: "2026-02-16",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("55+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Guidance Session with Fresh Juniors",
    start: "2026-03-05",
    format: "on-campus",
    focus: "community",
    myRole: "Speaker (as CSS President)",
    summary:
      "Class-to-class visits introducing CSS to freshers across all five programs.",
    stats: [selfReported("~300 attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Purpose of Life & Ramadan + Seerat Quiz",
    start: "2026-03-11",
    format: "on-campus",
    focus: "community",
    myRole: "Co-delivered (as CSS President)",
    stats: [selfReported("60+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "From Zero to GitHub Hero",
    start: "2026-04-01",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("60+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "From Open Source to Google DeepMind",
    start: "2026-04-04",
    format: "online",
    focus: "career",
    myRole: asPresident,
    stats: [selfReported("50+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Step into App Development",
    start: "2026-04-07",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("60+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "LinkedIn Optimization Masterclass",
    start: "2026-04-10",
    format: "online",
    focus: "career",
    myRole: asPresident,
    stats: [selfReported("90+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Turn Your Skills Into Income",
    start: "2026-05-05",
    format: "on-campus",
    focus: "career",
    myRole: asPresident,
    stats: [selfReported("100+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "One Year of Glory: Alumni Reunion",
    start: "2026-05-11",
    format: "on-campus",
    focus: "community",
    myRole: "Speaker (as CSS President)",
    summary:
      "Alumni reunion and graduation ceremony honouring the 2024–25 chapter.",
    stats: [selfReported("100+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "CSS × SMIT: Free IT Courses Session",
    start: "2026-05-19",
    format: "on-campus",
    focus: "career",
    myRole: asPresident,
    summary: "Free IT and AI courses awareness session with SMIT.",
    stats: [selfReported("120+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "Prompt Engineering Bootcamp (2 days)",
    start: "2026-05-21",
    end: "2026-05-22",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    stats: [selfReported("80+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "CSS Summer Bootcamp 2026 (3 tracks)",
    start: "2026-07-04",
    end: "2026-09-20",
    format: "online",
    focus: "technical",
    myRole: "Instructor, AI & Data Science track",
    summary:
      "Taught Machine Learning (classification, regression, evaluation), Deep Learning (neural networks, RNNs, LSTMs) and NLP as part of an end-to-end AI curriculum, and judged the final Project Exhibition, scoring projects on technical implementation and problem-solving. Participants came from the department and other universities. Co-delivered the AI & Data Science track with Abdullah Ahmad, Muhammad Jawad and Abubakar Saddiq, supervised by Dr. Waheed Ur Rehman.",
    stats: [
      selfReported(
        "70+ students across 3 tracks (AI & Data Science, Web Development, Cyber Security)",
      ),
      selfReported("35+ students in the 9-week AI & Data Science track"),
    ],
    featured: true,
    published: true,
  },
  {
    name: "Pentesting Masterclass",
    start: "2026-09-03",
    format: "online",
    focus: "technical",
    myRole: asPresident,
    summary:
      "Hands-on workshop with SheTech, including live bug bounty hunting.",
    stats: [selfReported("70+ attendees")],
    featured: false,
    published: true,
  },
  {
    name: "TechRise '26",
    start: "2026-10-22",
    format: "on-campus",
    focus: "technical",
    venue: "SSAQ Khan Hall, University of Peshawar",
    myRole:
      "Event lead — initiated and planned it as CSS President (Aug–Sep 2026)",
    summary:
      "A youth-focused tech event by the Computing Students Society, Department of Computer Science, connecting students across Khyber Pakhtunkhwa and beyond while creating opportunities for youth from the Newly Merged Districts. Promoted by the Directorate of Youth Affairs, Khyber Pakhtunkhwa. Theme: Learn · Connect · Rise.",
    stats: [
      selfReported("300+ attendees"),
      selfReported("9 speakers"),
      selfReported("3 sponsors"),
    ],
    featured: true,
    // The owner supplied these as .png files (the prompt listed .jpg).
    // Sponsors are counted but never named (owner decision, M5).
    photos: [
      {
        src: "/images/events/techrise-26/banner.png",
        alt: "TechRise '26 banner outside SSAQ Khan Hall, University of Peshawar",
      },
      {
        src: "/images/events/techrise-26/audience.png",
        alt: "A full hall of students at TechRise '26",
      },
      {
        src: "/images/events/techrise-26/panel.png",
        alt: "Career panel discussion on stage at TechRise '26",
      },
      {
        src: "/images/events/techrise-26/keynote.png",
        alt: "A speaker presenting to the audience at TechRise '26",
      },
    ],
    published: true,
  },
  {
    name: "CSS AI Bootcamp 2025",
    start: "2025-06",
    end: "2025-08",
    format: "online",
    focus: "technical",
    // Held during the AI/DS Club Lead term; name confirmed by the owner.
    myRole: "Lead & Instructor",
    summary:
      "Co-led and delivered an end-to-end AI learning program from Python fundamentals to Machine Learning and Agentic AI. Taught Python programming, NumPy, Pandas and Machine Learning, led academic planning (curriculum, assignments, quizzes, assessments and evaluation), and supervised the final student projects. Participants came from the department and other universities.",
    stats: [selfReported("30+ students")],
    featured: true,
    published: true,
  },
];
