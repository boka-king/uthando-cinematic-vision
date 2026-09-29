import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus, listEnquiries, updateEnquiry, STATUSES } from "@/lib/admin.functions";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Enquiry inbox — Uthandolwamandla" },
      { name: "description", content: "Private inbox for confidential enquiries." },
      { property: "og:title", content: "Enquiry inbox — Uthandolwamandla" },
      { property: "og:description", content: "Private inbox for confidential enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const LABEL: Record<(typeof STATUSES)[number], string> = {
  new: "New",
  in_progress: "In progress",
  replied: "Replied",
  closed: "Closed",
};

type Enquiry = Awaited<ReturnType<typeof listEnquiries>>[number];

function AdminPage() {
  const navigate = useNavigate();
  const statusFn = useServerFn(getAdminStatus);
  const listFn = useServerFn(listEnquiries);
  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => statusFn() });
  const list = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => listFn(),
    enabled: status.data?.isAdmin === true,
  });
  const [filter, setFilter] = useState<"all" | (typeof STATUSES)[number]>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => (list.data ?? []).filter((r) => filter === "all" || r.status === filter),
    [list.data, filter],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (status.isLoading) return <Shell><p className="text-sm text-muted-foreground">Checking access…</p></Shell>;
  if (!status.data?.isAdmin)
    return (
      <Shell onSignOut={signOut}>
        <p className="text-sm text-muted-foreground">
          This account doesn't have inbox access. Sign in with admin@uthandolwamandlasa.co.za (after
          confirming the email) to open the inbox.
        </p>
      </Shell>
    );

  return (
    <Shell onSignOut={signOut}>
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => {
          const count = s === "all" ? list.data?.length ?? 0 : (list.data ?? []).filter((r) => r.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`min-h-11 rounded-full border px-4 text-xs transition-colors ${filter === s ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "All" : LABEL[s]} · {count}
            </button>
          );
        })}
      </div>

      {list.isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading enquiries…</p>}
      {list.error && <p className="mt-10 text-sm text-destructive">Couldn't load enquiries.</p>}
      {!list.isLoading && rows.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">No enquiries here yet.</p>
      )}

      <ul className="mt-10 divide-y divide-border border-y border-border">
        {rows.map((r) => (
          <EnquiryRow key={r.id} row={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
        ))}
      </ul>
    </Shell>
  );
}

function Shell({ children, onSignOut }: { children: React.ReactNode; onSignOut?: () => void }) {
  return (
    <div className="px-6 pt-36 pb-32 sm:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="micro text-muted-foreground">Private</p>
            <h1 className="display mt-6 text-4xl sm:text-5xl">Enquiry inbox</h1>
          </div>
          {onSignOut && (
            <button onClick={onSignOut} className="micro min-h-11 text-muted-foreground hover:text-foreground">
              Sign out
            </button>
          )}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}

function EnquiryRow({ row, open, onToggle }: { row: Enquiry; open: boolean; onToggle: () => void }) {
  const qc = useQueryClient();
  const updateFn = useServerFn(updateEnquiry);
  const [notes, setNotes] = useState(row.notes ?? "");
  useEffect(() => setNotes(row.notes ?? ""), [row.notes]);

  const mutate = useMutation({
    mutationFn: (patch: { status?: (typeof STATUSES)[number]; notes?: string }) =>
      updateFn({ data: { id: row.id, ...patch } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Saved.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save."),
  });

  const isEmail = row.contact.includes("@");
  const phone = row.contact.replace(/[^\d+]/g, "").replace(/^0/, "+27");
  const date = new Date(row.created_at).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
  const subject = `Re: your enquiry to Uthandolwamandla${row.service ? ` — ${row.service}` : ""}`;

  return (
    <li>
      <button onClick={onToggle} aria-expanded={open}
        className="grid w-full grid-cols-[1fr_auto] gap-4 py-5 text-left sm:grid-cols-[1.2fr_1fr_auto_auto]">
        <span>
          <span className="block text-sm text-foreground">{row.name}</span>
          <span className="block text-xs text-muted-foreground">{row.contact}</span>
        </span>
        <span className="hidden truncate text-xs text-muted-foreground sm:block">{row.service ?? "General"}</span>
        <span className="hidden text-xs text-muted-foreground sm:block">{date}</span>
        <span className={`micro self-center rounded-full border px-3 py-1 ${row.status === "new" ? "border-primary text-foreground" : "border-border text-muted-foreground"}`}>
          {LABEL[row.status as keyof typeof LABEL] ?? row.status}
        </span>
      </button>

      {open && (
        <div className="space-y-8 pb-8">
          <p className="text-xs text-muted-foreground sm:hidden">{row.service ?? "General"} · {date}</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{row.message}</p>

          <div className="flex flex-wrap gap-3 text-sm">
            {isEmail ? (
              <a href={`mailto:${row.contact}?subject=${encodeURIComponent(subject)}`}
                className="inline-flex min-h-11 items-center rounded-full border border-border px-5 hover:border-primary">
                Reply by email
              </a>
            ) : (
              <>
                <a href={`tel:${phone}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-5 hover:border-primary">
                  Call
                </a>
                <a href={whatsappLink(phone, `Hello ${row.name}, this is Uthandolwamandla following up on your enquiry.`)}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-border px-5 hover:border-primary">
                  WhatsApp
                </a>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor={`status-${row.id}`} className="micro text-muted-foreground">Status</label>
            <select id={`status-${row.id}`} value={row.status}
              onChange={(e) => mutate.mutate({ status: e.target.value as (typeof STATUSES)[number] })}
              className="min-h-11 rounded-full border border-border bg-transparent px-4 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor={`notes-${row.id}`} className="micro text-muted-foreground">Private follow-up notes</label>
            <textarea id={`notes-${row.id}`} rows={3} value={notes} maxLength={5000}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-2 w-full resize-none border-b border-input bg-transparent py-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Called back on Tuesday, sending proposal…" />
            <button onClick={() => mutate.mutate({ notes })} disabled={mutate.isPending || notes === (row.notes ?? "")}
              className="mt-3 inline-flex min-h-11 items-center rounded-full border border-border px-5 text-sm hover:border-primary disabled:opacity-50">
              Save notes
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
