import { z } from "zod";

import {
  dpSgdExplainer as rawDpSgdExplainer,
  principles as rawPrinciples,
} from "./about";
import { caseStudies as rawCaseStudies } from "./case-studies";
import { chapter as rawChapter } from "./chapter";
import { credentials as rawCredentials } from "./credentials";
import { home as rawHome } from "./home";
import { initiatives as rawInitiatives } from "./initiatives";
import { profile as rawProfile } from "./profile";
import { projects as rawProjects } from "./projects";
import { roles as rawRoles } from "./roles";
import {
  assertCaseStudiesMatchProjects,
  CaseStudyList,
  Chapter,
  Credential,
  Explainer,
  Home,
  Initiative,
  Principle,
  Profile,
  ProjectList,
  Role,
  SkillGroup,
} from "./schema";
import { skills as rawSkills } from "./skills";

// Parsed at module load, so bad content fails `pnpm build`.
const profile = Profile.parse(rawProfile);
const projects = ProjectList.parse(rawProjects).toSorted(
  (a, b) => a.order - b.order,
);
const caseStudies = CaseStudyList.parse(rawCaseStudies);
assertCaseStudiesMatchProjects(caseStudies, projects);

const roles = z
  .array(Role)
  .parse(rawRoles)
  .filter((role) => role.published)
  .toSorted(
    (a, b) =>
      b.start.localeCompare(a.start) ||
      (b.end ?? "9999-12").localeCompare(a.end ?? "9999-12"),
  );
const initiatives = z
  .array(Initiative)
  .parse(rawInitiatives)
  .filter((initiative) => initiative.published)
  .toSorted(
    (a, b) =>
      b.start.localeCompare(a.start) ||
      (b.end ?? b.start).localeCompare(a.end ?? a.start),
  );
const credentials = z
  .array(Credential)
  .parse(rawCredentials)
  .filter((credential) => credential.published);
const skills = z.array(SkillGroup).parse(rawSkills);
const home = Home.parse(rawHome);
const chapter = Chapter.parse(rawChapter);
const principles = z.array(Principle).parse(rawPrinciples);
const dpSgdExplainer = Explainer.parse(rawDpSgdExplainer);

/** "TechRise '26" → "techrise-26": the in-page anchor for an initiative. */
export function initiativeId(initiative: { name: string }) {
  return initiative.name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const initiativeIds = new Set<string>();
for (const initiative of initiatives) {
  const id = initiativeId(initiative);
  if (!id || initiativeIds.has(id)) {
    throw new Error(`Initiative "${initiative.name}" has a duplicate anchor`);
  }
  initiativeIds.add(id);
}

// Every principle links to an anchor that exists on its case study.
const caseStudyAnchors = new Map(
  caseStudies.map((caseStudy) => [
    `/projects/${caseStudy.slug}`,
    new Set([
      "hard-problems",
      "decisions",
      "results",
      ...caseStudy.decisions.flatMap((d) => (d.anchor ? [d.anchor] : [])),
    ]),
  ]),
);
for (const { title, href } of principles) {
  const [path, anchor] = href.split("#");
  if (!caseStudyAnchors.get(path)?.has(anchor)) {
    throw new Error(`Principle "${title}" links to unknown anchor "${href}"`);
  }
}

// Credentials page order. Empty groups are left out.
const credentialGroups = (
  [
    { kind: "degree", id: "degree", title: "Degree" },
    { kind: "award", id: "awards", title: "Awards" },
    { kind: "certificate", id: "certificates", title: "Certificates" },
    { kind: "specialization", id: "specializations", title: "Specializations" },
    { kind: "course", id: "courses", title: "Courses" },
    { kind: "training", id: "training", title: "Training" },
  ] as const
)
  .map((group) => ({
    ...group,
    items: credentials.filter((credential) => credential.kind === group.kind),
  }))
  .filter((group) => group.items.length > 0);

// Leadership preview roles, oldest first. Each must match a published role.
const leadershipPath = home.leadershipPath
  .map(({ org, title }) => {
    const role = roles.find((r) => r.org === org && r.title === title);
    if (!role) {
      throw new Error(`Leadership path role "${title}" (${org}) not found`);
    }
    return role;
  })
  .toSorted((a, b) => a.start.localeCompare(b.start));

const usedInTargets = new Set([
  ...projects.map((project) => project.slug),
  "internship",
]);
for (const { name, usedIn } of skills.flatMap((group) => group.skills)) {
  for (const target of usedIn) {
    if (!usedInTargets.has(target)) {
      throw new Error(`Skill "${name}" has unknown usedIn "${target}"`);
    }
  }
}

// Home (M8.5): every capability links to real projects, and every
// recognition entry is a published award with a photo.
const capabilities = home.capabilities.map((capability) => ({
  ...capability,
  projects: capability.projects.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) {
      throw new Error(`Capability "${capability.title}" links to "${slug}"`);
    }
    return project;
  }),
}));

const recognition = home.recognition.map((name) => {
  const award = credentials.find(
    (credential) => credential.kind === "award" && credential.name === name,
  );
  if (!award?.photos?.[0]) {
    throw new Error(`Recognition "${name}" is not a published award photo`);
  }
  return award;
});

const leadershipPhoto = (() => {
  const { initiative: name, index } = home.leadership.photo;
  const photo = initiatives.find((i) => i.name === name)?.photos[index];
  if (!photo) throw new Error(`Leadership photo ${name}[${index}] not found`);
  return { initiative: name, ...photo };
})();

// Counted home stats must match the published content they count, and a
// stat's detail may only name items that are counted.
const liveProjects = projects.filter((project) =>
  project.links.some((link) => link.kind === "live"),
);
const specializations = credentials.filter(
  (credential) => credential.kind === "specialization",
);
const statCounts = {
  "live-projects": {
    count: liveProjects.length,
    names: liveProjects.map((project) => project.title),
  },
  specializations: {
    count: specializations.length,
    names: specializations.flatMap((credential) =>
      credential.issuer ? [credential.issuer] : [],
    ),
  },
} as const;
for (const stat of [...home.stats, ...home.leadership.stats]) {
  if (!stat.count) continue;
  const { count, names } = statCounts[stat.count];
  if (stat.value !== String(count)) {
    throw new Error(
      `Stat "${stat.label}" says ${stat.value}, but ${stat.count} counts ${count}`,
    );
  }
  for (const part of stat.detail?.split(" · ") ?? []) {
    if (!names.some((name) => name.includes(part))) {
      throw new Error(`Stat "${stat.label}" detail names "${part}"`);
    }
  }
}

/** Organizations where the owner held a role, newest first, as short wordmarks. */
const workedWith = [
  ...new Set(
    roles.map((role) =>
      role.org.replace(/,? University of Peshawar$/, "").trim(),
    ),
  ),
];

export const getProfile = () => profile;
export const getProjects = () => projects;
export const getFeaturedProjects = () =>
  projects.filter((project) => project.featured);
export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
/** The projects before and after this one, in project order. */
export const getAdjacentProjects = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug);
  return {
    previous: index > 0 ? projects[index - 1] : undefined,
    next: index >= 0 ? projects[index + 1] : undefined,
  };
};
/** Slugs of the projects that have a case study, in project order. */
export const getCaseStudySlugs = () =>
  projects
    .filter((project) => caseStudies.some((c) => c.slug === project.slug))
    .map((project) => project.slug);
export const getCaseStudy = (slug: string) =>
  caseStudies.find((caseStudy) => caseStudy.slug === slug);
export const getRoles = () => roles;
export const getInitiatives = () => initiatives;
export const getFeaturedInitiatives = () =>
  initiatives.filter((initiative) => initiative.featured);
export const getPublishedCredentials = (kind?: Credential["kind"]) =>
  kind
    ? credentials.filter((credential) => credential.kind === kind)
    : credentials;
export const getSkills = () => skills;
export const getCredentialGroups = () => credentialGroups;
/** The home row: the degree and awards with a public verify link. */
export const getHomeCredentials = () =>
  credentials.filter(
    (credential) =>
      credential.kind === "degree" ||
      (credential.kind === "award" && !!credential.verifyUrl),
  );
export const getCommunityRoles = () =>
  roles.filter((role) => role.track === "community");
export const getInternship = () =>
  roles.find((role) => role.track === "industry");
export const getInitiativeByName = (name: string) =>
  initiatives.find((initiative) => initiative.name === name);
export const getChapter = () => chapter;
export const getPrinciples = () => principles;
export const getDpSgdExplainer = () => dpSgdExplainer;
export const getHomeProof = () => home.proof;
export const getHomeHero = () => home.hero;
export const getHomeStats = () => home.stats;
export const getCapabilities = () => capabilities;
export const getHomeLeadership = () => ({
  ...home.leadership,
  photo: leadershipPhoto,
});
export const getRecognition = () => recognition;
export const getHomeContact = () => home.contact;
export const getWorkedWith = () => workedWith;
export const getLeadershipPath = () => leadershipPath;
