import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroField } from "@/components/site/HeroField";
import { PracticeIndex } from "@/components/site/PracticeIndex";
import { FounderPassage } from "@/components/site/FounderPassage";
import { Reveal } from "@/components/site/Reveal";

const TITLE = "Uthandolwamandla — HR, IR and CCMA specialists in Benoni";
const DESCRIPTION =
  "Recruitment, HR functions, IR/ER and CCMA representation with a 99% success rate, payroll, training and health & safety for South African employers. Based in Daveyton, Benoni.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Uthandolwamandla Managing and Distribution (Pty) Ltd",
          description: DESCRIPTION,
          founder: { "@type": "Person", name: "Zanele Mabuza" },
          email: "admin@uthandolwamandlasa.co.za",
          telephone: "+27738583423",
          address: {
            "@type": "PostalAddress",
            streetAddress: "4131 Mpinga Street",
            addressLocality: "Daveyton, Benoni",
            addressCountry: "ZA",
          },
          areaServed: "South Africa",
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroField />
      <PracticeIndex />
      <FounderPassage />

      <section className="px-6 py-32 sm:px-12 sm:py-48">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2 className="display text-3xl text-balance sm:text-5xl">
              Some conversations shouldn't start with a form on a busy page.
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Tell us what's happening — a dispute, a hire, a payroll you've outgrown — and we'll
              take it from there, in confidence.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <Link
              to="/conversation"
              className="group mt-12 inline-flex min-h-11 items-center gap-3 rounded-full border border-border px-7 py-3.5 text-sm transition-colors hover:border-primary hover:bg-primary/10"
            >
              Start a confidential conversation
              <span
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
