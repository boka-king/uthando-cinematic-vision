import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

export const THEME_KEY = "uth-theme";

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(THEME_KEY); } catch { /* Respect blocked storage. */ }
    const initial: Theme = stored === "light" ? "light" : "dark";
    setTheme(initial);
    apply(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable — the choice simply won't persist */
    }
  };

  return (
    <Button variant="ghost" size="icon"
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light view" : "Switch to dark view"}
      className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
}
