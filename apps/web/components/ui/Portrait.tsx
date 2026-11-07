import Image from "next/image";

import type { Profile } from "@/content/schema";

/**
 * The owner's portrait as a circle with a thin violet-to-lime ring and a
 * soft violet glow (owner choice, pre-M9 polish, option b). Used on the home
 * hero and /about. The crop is CSS only. The photo (1200×1600, dark violet
 * background to every edge) has the hair top at about 17% of its height and
 * the face centre at about 30%. Scale 1.2 about 50% 52% shows about 6.5%–69%
 * of the height: the face a little above the centre, clear space above the
 * hair, the jacket to mid-chest, and the photo filling the whole circle.
 */
export function Portrait({
  portrait,
  sizes,
  className = "",
}: {
  portrait: NonNullable<Profile["portrait"]>;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto w-full max-w-[240px] sm:max-w-[280px] lg:mr-0 lg:max-w-[320px] ${className}`}
    >
      <div
        aria-hidden="true"
        className="portrait-glow absolute -inset-12 -z-10"
      />
      <div className="portrait-ring rounded-full p-[3px] shadow-[0_20px_80px_-24px_color-mix(in_oklab,var(--signal)_60%,transparent)]">
        <div
          data-portrait
          className="relative aspect-square overflow-hidden rounded-full border-[6px] border-bg bg-surface-raised"
        >
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            preload
            sizes={sizes}
            className="origin-[50%_52%] scale-[1.2] object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}
