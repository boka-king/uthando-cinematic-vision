import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "./Logo";
import { cn } from "@/lib/utils";
import { EMAIL } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";


type NavLink = {
  to: "/" | "/conversation" | "/privacy" | "/terms";
  label: string;
  hash?: string;
};

const LINKS: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/", label: "Practice", hash: "practice" },
  { to: "/", label: "Founder", hash: "founder" },
  { to: "/conversation", label: "Start a conversation" },
  { to: "/privacy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a")?.focus();
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    if (main) main.inert = true;
    if (footer) footer.inert = true;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
      if (event.key !== "Tab") return;
      const items = [triggerRef.current, ...Array.from(panel?.querySelectorAll<HTMLElement>("a") ?? [])].filter((item): item is HTMLElement => item !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); if (main) main.inert = false; if (footer) footer.inert = false; triggerRef.current?.focus(); };
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-primary/70 transition-transform duration-300"
        style={{ transform: `scaleX(${progress})` }}
      />

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-gradient-to-b from-background via-background/85 to-transparent px-5 py-5 sm:px-10 sm:py-7">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-sm"
          aria-label="Uthandolwamandla — home"
        >
          <LogoMark className="shrink-0" />
          <span className="micro hidden text-muted-foreground sm:inline">Uthandolwamandla</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <ThemeToggle />
          <Button variant="ghost" ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-index"
            className="micro flex min-h-11 items-center gap-3 rounded-sm px-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? "Close" : "Index"}
            <span aria-hidden="true" className="flex flex-col gap-1">
              <span
                className={cn(
                  "block h-px w-6 bg-current transition-transform duration-500",
                  open && "translate-y-[3px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-current transition-transform duration-500",
                  open && "-translate-y-[3px] -rotate-45",
                )}
              />
            </span>
          </Button>
        </div>

      </header>

      <div
        id="site-index"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-30 flex flex-col justify-center bg-background/95 px-6 backdrop-blur-xl sm:px-16"
      >
        <nav aria-label="Site index" className="mx-auto w-full max-w-3xl">
          <ul className="space-y-2">
            {LINKS.map((link, i) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  {...(link.hash ? { hash: link.hash } : {})}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: `${120 + i * 70}ms` }}
                  data-shown={open}
                  className="reveal display block py-2 text-3xl text-muted-foreground transition-colors hover:text-foreground sm:text-5xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="micro mt-12 text-muted-foreground">
            <a href={`mailto:${EMAIL}`} className="hover:text-foreground">
              {EMAIL}
            </a>
          </p>
        </nav>
      </div>
    </>
  );
}
