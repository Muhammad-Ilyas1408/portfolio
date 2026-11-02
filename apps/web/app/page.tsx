import { Container } from "@/components/ui/Container";
import { getProfile } from "@/content";

export default function Home() {
  const profile = getProfile();

  return (
    <Container className="py-16">
      <h1 className="md:text-3xl">{profile.name}</h1>
      <p className="mt-4 max-w-[68ch] text-lg text-text-muted">
        {profile.positioning}
      </p>
    </Container>
  );
}
