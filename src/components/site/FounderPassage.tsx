import { Reveal } from "./Reveal";
import { ADDRESS, prettyPhone } from "@/lib/site";

export function FounderPassage() {
  return (
    <section id="founder" className="relative scroll-mt-24 overflow-hidden px-6 py-32 sm:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_28rem_at_70%_40%,color-mix(in_oklab,var(--color-primary)_14%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <p className="micro text-muted-foreground">Founder</p>
        </Reveal>
        <Reveal delay={150}>
          <h2 className="display mt-10 text-3xl text-balance sm:text-5xl">
            “To empower people and build stronger futures.”
          </h2>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-10 max-w-xl text-sm leading-loose text-muted-foreground">
            Uthandolwamandla was founded by Zanele Mabuza on a simple conviction: an employer and
            an employee are both better served when the process between them is fair, documented
            and handled by someone who knows the law. That conviction is the mission of the firm —
            to empower people and build stronger futures — and it runs through every placement,
            every hearing and every payroll run we take on.
          </p>
        </Reveal>
        <Reveal delay={420}>
          <div className="mt-12 space-y-1">
            <p className="text-sm text-foreground">Zanele Mabuza</p>
            <p className="micro text-muted-foreground">Managing Member &amp; Founder</p>
            <p className="mt-4 text-sm text-muted-foreground">{ADDRESS}</p>
            <a
              href="tel:+27738583423"
              className="inline-block text-sm text-foreground underline-offset-4 hover:underline"
            >
              {prettyPhone("+27738583423")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
