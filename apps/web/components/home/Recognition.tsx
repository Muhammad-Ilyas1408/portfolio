import Image from "next/image";

import { cardClasses } from "@/components/ui/Card";
import { DisplaySection } from "@/components/ui/DisplaySection";
import type { Credential } from "@/content/schema";

/** "Award of Appreciation — President, CSS Chapter 2025–26" → title and detail. */
export function splitAwardName(name: string) {
  const [title, ...rest] = name.split(" — ");
  return { title, detail: rest.join(" — ") || undefined };
}

export function Recognition({
  awards,
  number,
}: {
  awards: Credential[];
  number: string;
}) {
  if (awards.length === 0) return null;

  return (
    <DisplaySection
      id="recognition"
      number={number}
      accent="ember"
      eyebrow="Recognition"
      title="Awards and recognition"
      viewAll={{ href: "/credentials#awards", label: "All awards" }}
    >
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {awards.map((award) => {
          const photo = award.photos?.[0];
          const { title, detail } = splitAwardName(award.name);
          return (
            <li key={award.name}>
              <figure className={cardClasses({ className: "h-full p-2.5" })}>
                {photo && (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-raised">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-3"
                    />
                  </div>
                )}
                <figcaption className="px-2.5 pt-4 pb-2">
                  <span className="block font-semibold text-text">{title}</span>
                  {detail && (
                    <span className="mt-1 block text-sm text-text-muted">
                      {detail}
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </DisplaySection>
  );
}
