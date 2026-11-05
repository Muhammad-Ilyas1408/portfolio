import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/shared/JsonLd";
import { getProfile, getPublishedCredentials } from "@/content";
import { personJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const profile = getProfile();

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Defaults for every route; each page sets its own title, description,
// canonical and Open Graph fields through pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata({
    title: `${profile.name} — ${profile.title}`,
    description: profile.positioning,
  }),
};

const person = personJsonLd(profile, getPublishedCredentials("degree")[0]);

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={person} />
        <a
          href="#main"
          className="absolute -top-full left-4 z-20 rounded-md bg-surface-raised px-4 py-2 text-sm text-text focus:top-2"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
