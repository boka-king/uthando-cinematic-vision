import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please tell us your name." })
    .max(80, { message: "Name must be under 80 characters." }),
  contact: z
    .string()
    .trim()
    .min(5, { message: "An email address or phone number, please." })
    .max(120, { message: "Must be under 120 characters." }),
  service: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, { message: "A little more detail helps us prepare — 20 characters minimum." })
    .max(2000, { message: "Please keep it under 2000 characters." }),
  // Anti-spam: decoy field must stay empty, and the form must have been open a moment.
  company: z.string().max(0).optional().or(z.literal("")),
  elapsedMs: z.number().int().nonnegative(),
});

export type ContactInput = z.infer<typeof contactSchema>;

const MIN_DWELL_MS = 3000;
const MAX_PER_HOUR = 3;

export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) {
      // Silently accept: bots get a success shape, nothing is stored.
      return { ok: true as const };
    }
    if (data.elapsedMs < MIN_DWELL_MS) {
      throw new Error("That was submitted a little too quickly. Please try again.");
    }

    const request = getRequest();
    const headers = request.headers;
    const ip =
      headers.get("cf-connecting-ip") ??
      headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const userAgent = headers.get("user-agent")?.slice(0, 300) ?? "unknown";

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabaseAdmin
      .from("contact_requests")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", since);

    if (countError) {
      console.error("contact rate-limit check failed", countError);
      throw new Error("We couldn't send that just now. Please try again shortly.");
    }
    if ((count ?? 0) >= MAX_PER_HOUR) {
      throw new Error(
        "You've already sent us a few messages. Please call or WhatsApp us instead — we'll answer.",
      );
    }

    const { error } = await supabaseAdmin.from("contact_requests").insert({
      name: data.name,
      contact: data.contact,
      service: data.service || null,
      message: data.message,
      ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error("contact insert failed", error);
      throw new Error("We couldn't send that just now. Please try again shortly.");
    }

    return { ok: true as const };
  });
