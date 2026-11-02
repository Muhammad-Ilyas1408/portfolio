export const navLinks = [
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/leadership", label: "Leadership" },
  { href: "/credentials", label: "Credentials" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// TODO: public/cv.pdf arrives later (PLAN.md section 11, item 8).
export const cvHref = "/cv.pdf";

export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
