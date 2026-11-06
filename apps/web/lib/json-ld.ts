import type { Credential, Profile, Project } from "@/content/schema";

import { absoluteUrl, siteUrl } from "./site";

export const personId = `${siteUrl}/#person`;

type Thing = Record<string, unknown>;

/** schema.org Person for the root layout. Every value comes from content/. */
export function personJsonLd(profile: Profile, degree?: Credential): Thing {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    jobTitle: profile.title,
    url: absoluteUrl("/"),
    ...(profile.portrait && { image: absoluteUrl(profile.portrait.src) }),
    email: profile.links.email.replace(/^mailto:/, ""),
    ...(degree?.issuer && {
      alumniOf: { "@type": "CollegeOrUniversity", name: degree.issuer },
    }),
    sameAs: [
      profile.links.github,
      profile.links.linkedin,
      ...(profile.links.kaggle ? [profile.links.kaggle] : []),
    ],
  };
}

/**
 * schema.org CreativeWork for a case study. The site owner is referenced by
 * `@id`; other team members are listed by name so authorship stays accurate.
 * Repo, live and Devpost links from projects.ts go in `sameAs`
 * (`codeRepository` is not a CreativeWork property).
 */
export function caseStudyJsonLd(project: Project, owner: Profile): Thing {
  const others = project.team.filter((member) => member.name !== owner.name);
  const author = [
    { "@type": "Person", "@id": personId, name: owner.name },
    ...others.map((member) => ({ "@type": "Person", name: member.name })),
  ];
  const sameAs = project.links
    .filter((link) => ["repo", "live", "devpost"].includes(link.kind))
    .map((link) => link.url);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`),
    author: author.length === 1 ? author[0] : author,
    ...(sameAs.length > 0 && { sameAs }),
    keywords: project.stack.join(", "),
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<" so it cannot close it. */
export function serializeJsonLd(data: Thing) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
