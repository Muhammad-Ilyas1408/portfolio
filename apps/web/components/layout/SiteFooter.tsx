import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";

const links = [
  { href: profile.links.email, label: "Email", external: false },
  { href: profile.links.github, label: "GitHub", external: true },
  { href: profile.links.linkedin, label: "LinkedIn", external: true },
  { href: profile.links.kaggle, label: "Kaggle", external: true },
  { href: profile.links.source, label: "Source on GitHub", external: true },
];

// Captured in the static shell, so the year updates on each build.
async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col gap-4 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map(({ href, label, external }) => (
            <li key={label}>
              <a
                href={href}
                {...(external && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="inline-flex min-h-6 items-center underline underline-offset-4 transition-colors duration-150 hover:text-text"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p>
          © {year} {profile.name}
        </p>
      </Container>
    </footer>
  );
}
