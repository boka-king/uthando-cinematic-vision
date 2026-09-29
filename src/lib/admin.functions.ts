import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OWNER_EMAIL = "admin@uthandolwamandlasa.co.za";
export const STATUSES = ["new", "in_progress", "replied", "closed"] as const;

/** Returns whether the caller is an admin. The verified owner mailbox is granted admin on first sign-in. */
export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (isAdmin) return { isAdmin: true };

    const email = String((claims as Record<string, unknown>)["email"] ?? "").toLowerCase();
    const { data: userData } = await supabase.auth.getUser();
    const confirmed = !!userData.user?.email_confirmed_at;
    if (email === OWNER_EMAIL && confirmed) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
      if (error) {
        console.error("admin grant failed", error);
        return { isAdmin: false };
      }
      return { isAdmin: true };
    }
    return { isAdmin: false };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("contact_requests")
      .select("id, name, contact, service, message, status, notes, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      console.error("list enquiries failed", error);
      throw new Error("Couldn't load enquiries.");
    }
    return data ?? [];
  });

export const updateEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(STATUSES).optional(),
        notes: z.string().max(5000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const patch: { updated_at: string; status?: string; notes?: string } = {
      updated_at: new Date().toISOString(),
    };
    if (data.status) patch.status = data.status;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await context.supabase.from("contact_requests").update(patch).eq("id", data.id);
    if (error) {
      console.error("update enquiry failed", error);
      throw new Error("Couldn't save that change.");
    }
    return { ok: true as const };
  });
