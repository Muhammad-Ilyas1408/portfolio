import { ArrowLink } from "@/components/ui/ArrowLink";
import { Card } from "@/components/ui/Card";
import { DisplaySection } from "@/components/ui/DisplaySection";
import type { Project } from "@/content/schema";

type Capability = { title: string; line: string; projects: Project[] };

export function WhatIBuild({
  capabilities,
  number,
}: {
  capabilities: Capability[];
  number: string;
}) {
  if (capabilities.length === 0) return null;

  return (
    <DisplaySection
      id="what-i-build"
      number={number}
      eyebrow="Capabilities"
      title="What I build"
    >
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((capability, index) => (
          <li key={capability.title} className="flex">
            <Card
              variant="numbered"
              number={String(index + 1).padStart(2, "0")}
              interactive
              className="flex w-full flex-col"
            >
              <h3 className="mt-10 font-display text-[1.375rem] leading-snug font-semibold tracking-tight">
                {capability.title}
              </h3>
              <p className="mt-3 text-text-muted">{capability.line}</p>
              {/* pt-6 keeps a gap above the divider in the tallest card. */}
              <div className="mt-auto pt-6">
                <div className="border-t border-border pt-5">
                  <p className="font-mono text-xs tracking-[0.16em] text-text-muted uppercase">
                    See it in
                  </p>
                  <ul className="mt-1 flex flex-wrap gap-x-5 lg:min-h-22">
                    {capability.projects.map((project) => (
                      <li key={project.slug}>
                        <ArrowLink
                          href={`/projects/${project.slug}`}
                          aria-label={`${capability.title}: see it in ${project.title}`}
                        >
                          {project.title}
                        </ArrowLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </DisplaySection>
  );
}
