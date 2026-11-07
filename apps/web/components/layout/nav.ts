export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/leadership", label: "Leadership" },
  { href: "/credentials", label: "Credentials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** The desktop nav: Contact is the header's primary button instead. */
export const desktopNavLinks = navLinks.filter(
  ({ href }) => href !== "/contact",
);

// TODO: public/cv.pdf arrives later (PLAN.md section 11, item 8).
export const cvHref = "/cv.pdf";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
