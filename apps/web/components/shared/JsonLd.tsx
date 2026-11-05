import { serializeJsonLd } from "@/lib/json-ld";

/** Server-rendered structured data. A data block, so CSP script-src does not apply. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
