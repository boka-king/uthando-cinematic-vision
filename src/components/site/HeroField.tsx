import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import markAsset from "@/assets/logo-mark.png.asset.json";

/**
 * Subtle 3D opening field: layered violet light with pointer parallax and a
 * slow settle on scroll. CSS transforms only — no 3D library, no heavy assets.
 */
export function HeroField() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Pointer parallax is a desktop nicety only: on touch devices it never
    // fires and the listener would just cost battery, so skip it entirely.
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        setTilt({ x, y });
      });
    };
    const onScroll = () => setScrolled(Math.min(1, window.scrollY / (window.innerHeight || 1)));

    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      className="relative flex min-h-dvh flex-col justify-between overflow-hidden px-6 pt-32 pb-12 sm:px-12"
      style={{ perspective: "1200px" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 aurora drift" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_50%_120%,transparent,var(--color-background))]"
      />
      {/* Depth rings: three faint planes offset by pointer tilt. Hidden on
          small screens, where the composition stays flat and light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex"
      >
        {[0, 1, 2].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-border/40"
            style={{
              width: `${26 + ring * 16}rem`,
              height: `${26 + ring * 16}rem`,
              opacity: 0.5 - ring * 0.14,
              transform: `translate3d(${tilt.x * (10 + ring * 8)}px, ${tilt.y * (8 + ring * 6)}px, 0)`,
              transition: "transform 1400ms cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        ))}
      </div>

      <div
        ref={sceneRef}
        className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-10 text-center"
        style={{
          transform: `translateY(${scrolled * -40}px)`,
          opacity: 1 - scrolled * 0.6,
        }}
      >
        <div
          className="mark-in relative"
          style={{
            transform: `rotateX(${tilt.y * -6}deg) rotateY(${tilt.x * 8}deg) translateZ(0)`,
            transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/25 blur-3xl"
          />
          <img
            src={markAsset.url}
            alt="Uthandolwamandla emblem: two figures forming a heart around rising bars"
            width={180}
            height={180}
            className="h-28 w-28 object-contain sm:h-44 sm:w-44"
            fetchPriority="high"
          />
        </div>

        <div
          className="mark-in space-y-6"
          style={{
            animationDelay: "500ms",
            transform: `translate3d(${tilt.x * -8}px, ${tilt.y * -6}px, 0)`,
            transition: "transform 1200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="micro text-muted-foreground">
            Uthandolwamandla Managing and Distribution (Pty) Ltd
          </p>
          <h1 className="display mx-auto max-w-3xl text-4xl text-balance sm:text-6xl md:text-7xl">
            People handled with care. Risk handled with precision.
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
            A South African human resources practice for employers who would rather get it right the
            first time — quietly, and in confidence.
          </p>
        </div>

        <Link
          to="/conversation"
          className="mark-in group inline-flex min-h-11 items-center gap-3 rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/10"
          style={{ animationDelay: "900ms" }}
        >
          Start a confidential conversation
          <span
            aria-hidden="true"
            className="transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>

      <p className="micro relative mx-auto text-muted-foreground/70">Scroll to explore</p>
    </section>
  );
}
