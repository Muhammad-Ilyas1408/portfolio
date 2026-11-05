import Image from "next/image";

import type { Photo } from "@/content/schema";

/** A grid of photos; each alt text comes from content. */
export function PhotoGrid({
  photos,
  columns = "sm:grid-cols-2 lg:grid-cols-4",
  sizes = "(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw",
}: {
  photos: Photo[];
  columns?: string;
  sizes?: string;
}) {
  if (photos.length === 0) return null;

  return (
    <ul className={`grid gap-3 ${columns}`}>
      {photos.map((photo) => (
        <li
          key={photo.src}
          className="relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-surface-raised"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
