import { z } from "zod";

import { credentials as rawCredentials } from "./credentials";
import { home as rawHome } from "./home";
import { initiatives as rawInitiatives } from "./initiatives";
import { profile as rawProfile } from "./profile";
import { projects as rawProjects } from "./projects";
import { roles as rawRoles } from "./roles";
import {
  Credential,
  Home,
  Initiative,
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

export const getProfile = () => profile;
export const getProjects = () => projects;
export const getFeaturedProjects = () =>
  projects.filter((project) => project.featured);
export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);
export const getRoles = () => roles;
export const getInitiatives = () => initiatives;
export const getFeaturedInitiatives = () =>
  initiatives.filter((initiative) => initiative.featured);
export const getPublishedCredentials = (kind?: Credential["kind"]) =>
  kind
    ? credentials.filter((credential) => credential.kind === kind)
    : credentials;
export const getSkills = () => skills;
export const getHomeProof = () => home.proof;
export const getLeadershipPath = () => leadershipPath;
