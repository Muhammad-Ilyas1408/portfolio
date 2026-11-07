import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Image rules from docs/CONTENT-GUIDE.md (M9), checked on every file in
 * public/: JPEG or PNG only, no EXIF metadata (it can hold GPS location and
 * camera details), longest side at most 1600px, and at most 1 MB.
 */
const PUBLIC_DIR = join(process.cwd(), "public");
const MAX_SIDE = 1600;
const MAX_BYTES = 1024 * 1024;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const images = walk(PUBLIC_DIR).filter((path) =>
  IMAGE_EXTENSIONS.includes(extname(path).toLowerCase()),
);

/** Width and height, plus whether the file carries EXIF. */
function inspect(data: Buffer, ext: string) {
  if (ext === ".png") {
    let exif = false;
    // Walk the chunks: 8-byte signature, then length, type, data, CRC.
    for (let i = 8; i + 8 <= data.length;) {
      const length = data.readUInt32BE(i);
      if (data.toString("latin1", i + 4, i + 8) === "eXIf") exif = true;
      i += 12 + length;
    }
    return {
      width: data.readUInt32BE(16),
      height: data.readUInt32BE(20),
      exif,
    };
  }
  // JPEG: walk the segments until the start-of-frame marker.
  let exif = false;
  for (let i = 2; i + 4 <= data.length;) {
    const marker = data[i + 1];
    const length = data.readUInt16BE(i + 2);
    if (marker === 0xe1 && data.toString("latin1", i + 4, i + 8) === "Exif") {
      exif = true;
    }
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: data.readUInt16BE(i + 5),
        width: data.readUInt16BE(i + 7),
        exif,
      };
    }
    i += 2 + length;
  }
  throw new Error("no JPEG frame header found");
}

describe("images in public/", () => {
  it("finds the site's images", () => {
    expect(images.length).toBeGreaterThan(0);
  });

  for (const path of images) {
    const name = relative(PUBLIC_DIR, path).replaceAll("\\", "/");
    const ext = extname(path).toLowerCase();

    it(`${name} is a JPEG or PNG without EXIF, ≤ ${MAX_SIDE}px and ≤ 1 MB`, () => {
      expect([".jpg", ".jpeg", ".png"]).toContain(ext);
      const data = readFileSync(path);
      const { width, height, exif } = inspect(data, ext);

      expect(exif, "strip the EXIF data (CONTENT-GUIDE.md)").toBe(false);
      expect(Math.max(width, height)).toBeLessThanOrEqual(MAX_SIDE);
      expect(data.length).toBeLessThanOrEqual(MAX_BYTES);
    });
  }
});
