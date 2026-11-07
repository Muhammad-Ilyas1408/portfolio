import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import { desktopNavLinks, isActive, navLinks } from "@/components/layout/nav";
import { getProfile } from "@/content";
import { profile as profileInput } from "@/content/profile";
import { Profile } from "@/content/schema";
import { personJsonLd } from "@/lib/json-ld";
import { formatPhone } from "@/lib/phone";

// Pre-M9 owner polish: Home link, WhatsApp and phone, the new about paragraph.

describe("Home nav link", () => {
  it("is the first link on desktop and in the mobile menu", () => {
    expect(navLinks[0]).toEqual({ href: "/", label: "Home" });
    expect(desktopNavLinks[0]).toEqual({ href: "/", label: "Home" });
    expect(navLinks.filter(({ href }) => href === "/")).toHaveLength(1);
  });

  it("is current on / only", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/projects", "/")).toBe(false);
    expect(isActive("/projects/flood-aware", "/")).toBe(false);
  });
});

describe("phone and WhatsApp", () => {
  const { links } = getProfile();

  it("are in profile.links", () => {
    expect(links.phone).toBe("tel:+923154710472");
    expect(links.whatsapp).toBe(
      "https://wa.me/923154710472?text=Hi%20Muhammad%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.",
    );
  });

  it("are optional in the schema and validated when set", () => {
    const rest: Record<string, unknown> = { ...profileInput.links };
    delete rest.phone;
    delete rest.whatsapp;
    expect(Profile.safeParse({ ...profileInput, links: rest }).success).toBe(
      true,
    );
    const bad = (links: object) =>
      Profile.safeParse({
        ...profileInput,
        links: { ...profileInput.links, ...links },
      }).success;
    expect(bad({ phone: "+923154710472" })).toBe(false);
    expect(bad({ whatsapp: "https://example.com/923154710472" })).toBe(false);
  });

  it("formats the number for display", () => {
    expect(formatPhone("tel:+923154710472")).toBe("+92 315 4710472");
    expect(formatPhone("tel:+4930123456")).toBe("+4930123456");
  });

  it("are shown on /contact with accessible names, next to the email", () => {
    render(<ContactPage />);
    const whatsapp = screen.getByRole("link", {
      name: "Message on WhatsApp (opens in a new tab)",
    });
    expect(whatsapp).toHaveAttribute("href", links.whatsapp);
    expect(whatsapp).toHaveAttribute("target", "_blank");
    expect(whatsapp).toHaveAttribute("rel", "noopener noreferrer");
    const call = screen.getByRole("link", { name: "+92 315 4710472" });
    expect(call).toHaveAttribute("href", "tel:+923154710472");
    expect(call).not.toHaveAttribute("target");
    // The email link stays.
    expect(
      screen.getByRole("link", { name: "muhammadilyas.ai.eng@gmail.com" }),
    ).toHaveAttribute("href", "mailto:muhammadilyas.ai.eng@gmail.com");
  });

  it("are not in the JSON-LD", () => {
    const json = JSON.stringify(personJsonLd(getProfile()));
    expect(json).not.toContain("4710472");
    expect(json).not.toContain("wa.me");
  });
});

describe("/about", () => {
  it("keeps the about text and adds exactly one paragraph after it", () => {
    const { container } = render(<AboutPage />);
    const profile = getProfile();
    const leadership =
      "Beyond engineering, I served as President of the Computing Students Society at the University of Peshawar (2025–2026), where our team of around 40 members organized 18 events, and TechRise ’26, a tech conference attended by over 300 people.";
    expect(profile.aboutLeadership).toBe(leadership);

    const about = screen.getByText(profile.about);
    const next = about.nextElementSibling;
    expect(next?.tagName).toBe("P");
    expect(next).toHaveTextContent(leadership);
    expect(next?.nextElementSibling).toBeNull();
    expect(about.previousElementSibling).toBeNull();
    expect(container.textContent).toContain(profile.about);
  });
});
