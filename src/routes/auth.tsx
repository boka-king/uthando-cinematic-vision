import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff sign in — Uthandolwamandla" },
      {
        name: "description",
        content: "Private staff sign-in for the Uthandolwamandla enquiry inbox.",
      },
      { property: "og:title", content: "Staff sign in — Uthandolwamandla" },
      { property: "og:description", content: "Private staff sign-in for the enquiry inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full border-b border-input bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Check your inbox to confirm your email, then sign in.");
        setMode("in");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 pt-28 pb-20">
      <form onSubmit={submit} className="w-full max-w-sm space-y-8">
        <div>
          <p className="micro text-muted-foreground">Staff only</p>
          <h1 className="display mt-6 text-4xl">
            {mode === "in" ? "Enquiry inbox" : "Create staff account"}
          </h1>
        </div>
        <div>
          <label htmlFor="email" className="micro text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="micro text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className={field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 items-center rounded-full border border-border px-6 text-sm transition-colors hover:border-primary hover:bg-primary/10 disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="micro block min-h-11 text-muted-foreground hover:text-foreground"
        >
          {mode === "in" ? "First time? Create your account" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
