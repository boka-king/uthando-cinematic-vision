import { Link } from "@tanstack/react-router";
import { ADDRESS, CONTACTS, EMAIL, SITE_NAME, prettyPhone } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16 sm:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs space-y-3">
          <p className="micro text-muted-foreground">{SITE_NAME}</p>
          <p className="text-sm text-muted-foreground">{ADDRESS}</p>
          <a
            href={`mailto:${EMAIL}`}
            className="block text-sm text-foreground underline-offset-4 hover:underline"
          >
            {EMAIL}
          </a>
        </div>

        <div className="space-y-3">
          <p className="micro text-muted-foreground">Direct</p>
          <ul className="space-y-2 text-sm">
            {CONTACTS.map((c) => (
              <li key={c.phone}>
                <a
                  href={`tel:${c.phone}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {c.name} — {prettyPhone(c.phone)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="micro text-muted-foreground">More</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/conversation" className="hover:underline">
                Start a confidential conversation
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                Terms and conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="micro mx-auto mt-14 max-w-5xl text-muted-foreground">
        © {new Date().getFullYear()} Uthandolwamandla Managing and Distribution (Pty) Ltd
      </p>
    </footer>
  );
}
