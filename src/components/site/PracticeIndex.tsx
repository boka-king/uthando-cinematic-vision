import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { SERVICES } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PracticeIndex() {
  const [active, setActive] = useState<string | null>(SERVICES[0].id);

  return (
    <section id="practice" className="scroll-mt-24 px-6 pt-5 pb-32 sm:px-12 sm:pb-48">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="micro text-muted-foreground">What we carry for you</p>
        </Reveal>

        <ul className="mt-16 divide-y divide-border border-y border-border">
          {SERVICES.map((service, i) => {
            const open = active === service.id;
            return (
              <li
                key={service.id}
                id={service.id}
                className="scroll-mt-24"
                onMouseEnter={() => setActive(service.id)}
              >
                <Reveal delay={i * 90}>
                  <Button variant="ghost"
                    type="button"
                    aria-expanded={open}
                    aria-controls={`${service.id}-detail`}
                    onClick={() => setActive(open ? null : service.id)}
                    onFocus={() => setActive(service.id)}
                    className={cn(
                      "group flex h-auto w-full items-baseline gap-5 rounded-none px-0 py-7 text-left whitespace-normal font-normal transition-opacity duration-700 hover:bg-transparent sm:gap-10",
                      active && !open ? "opacity-45 hover:opacity-100" : "opacity-100",
                    )}
                  >
                    <span className="micro w-6 shrink-0 text-primary">{service.index}</span>
                    <span className="flex-1">
                      <span className="display block text-xl sm:text-2xl">{service.title}</span>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        {service.lead}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "hidden text-muted-foreground transition-transform duration-700 sm:block",
                        open && "rotate-90 text-primary",
                      )}
                    >
                      →
                    </span>
                  </Button>

                  <div
                    id={`${service.id}-detail`}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-700 ease-out",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-8 text-sm leading-relaxed text-muted-foreground sm:pl-16">
                        {service.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-32 text-center" delay={120}>
          <p className="display text-7xl text-primary-glow sm:text-9xl">99%</p>
          <p className="micro mt-4 text-muted-foreground">
            Success rate in CCMA matters we represent
          </p>
          <Link
            to="/conversation"
            className="mt-10 inline-flex min-h-11 items-center text-sm text-foreground underline underline-offset-8 transition-colors hover:text-primary-glow"
          >
            Talk to us about a matter
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
