import { Link } from "@tanstack/react-router";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "./Logo";

const HeroDepth = lazy(() => import("./HeroDepth"));

class DepthBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? null : this.props.children; }
}

/**
 * Readable logo-first opening with optional, client-only desktop 3D depth.
 */
export function HeroField() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(0);
  const [depth, setDepth] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let visible = true;
    const update = () => setDepth(media.matches && visible && !document.hidden && document.documentElement.classList.contains("dark"));
    const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; update(); });
    if (sceneRef.current) observer.observe(sceneRef.current);
    const themeObserver = new MutationObserver(update);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); themeObserver.disconnect(); media.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);

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
      ref={sceneRef}
      className="cinematic-opening relative flex flex-col justify-between overflow-hidden px-6 pt-28 pb-8 sm:px-12"
    >
      {depth && <div aria-hidden="true" className="hero-depth absolute inset-0"><DepthBoundary><Suspense fallback={null}><HeroDepth /></Suspense></DepthBoundary></div>}

      <div
        className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-7 text-center"
        style={{
          transform: `translateY(${scrolled * -40}px)`,
          opacity: 1 - scrolled * 0.6,
        }}
      >
        <div
          className="relative max-w-full shrink-0"
          style={{
            transform: `rotateX(${tilt.y * -6}deg) rotateY(${tilt.x * 8}deg) translateZ(0)`,
            transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <LogoLockup imgClassName="hero-logo block h-auto w-72 max-w-full object-contain sm:w-96" />
        </div>

        <div
          className="mark-in space-y-4"
          style={{
            animationDelay: "500ms",
            transform: `translate3d(${tilt.x * -8}px, ${tilt.y * -6}px, 0)`,
            transition: "transform 1200ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <h1 className="sr-only">Uthandolwamandla Managing and Distribution (Pty) Ltd</h1>
          <p className="mx-auto max-w-sm text-base leading-relaxed text-balance sm:text-lg">
            People handled with care. Risk handled with precision.
          </p>
          <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
            A South African human resources practice for employers who would rather get it right
            the first time — quietly, and in confidence.
          </p>
        </div>

        <Button asChild variant="ghost" className="mark-in group mt-1 h-auto min-h-11 rounded-none px-2 py-3 text-xs font-normal text-muted-foreground hover:bg-transparent hover:text-foreground">
        <Link
          to="/conversation"
          style={{ animationDelay: "900ms" }}
        >
          Start a confidential conversation
          <ArrowUpRight aria-hidden="true" className="transition-transform duration-700 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
        </Button>
      </div>

      <Button asChild variant="ghost" size="icon" className="relative mx-auto mt-6 text-muted-foreground hover:bg-transparent hover:text-foreground"><a href="#practice" aria-label="Explore our practice"><ArrowDown aria-hidden="true" /></a></Button>
    </section>
  );
}
