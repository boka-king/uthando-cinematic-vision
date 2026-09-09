import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { submitContactRequest } from "@/lib/contact.functions";
import { SERVICES } from "@/lib/site";

const formSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(80, "Under 80 characters."),
  contact: z
    .string()
    .trim()
    .min(5, "An email address or phone number, please.")
    .max(120, "Under 120 characters."),
  service: z.string().max(60).optional(),
  message: z
    .string()
    .trim()
    .min(20, "A little more detail helps us prepare — 20 characters minimum.")
    .max(2000, "Please keep it under 2000 characters."),
  company: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClass =
  "w-full border-b border-input bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function ContactForm() {
  const send = useServerFn(submitContactRequest);
  const [sent, setSent] = useState(false);
  const openedAt = useRef(Date.now());
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", contact: "", service: "", message: "", company: "" },
  });

  const serviceOptions = useMemo(() => SERVICES.map((s) => s.title), []);

  const onSubmit = async (values: FormValues) => {
    try {
      await send({
        data: {
          ...values,
          service: values.service ?? "",
          company: values.company ?? "",
          elapsedMs: Date.now() - openedAt.current,
        },
      });
      setSent(true);
      reset();
      toast.success("Message received. We'll reply in confidence.");
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "We couldn't send that just now. Please try again.";
      toast.error(message);
    }
  };

  if (sent) {
    return (
      <div className="border border-border p-8" role="status">
        <p className="display text-2xl">Thank you — it's with us.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Your message is held in confidence and one of our team will respond shortly. If it's
          urgent, please call or WhatsApp us.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            openedAt.current = Date.now();
          }}
          className="micro mt-8 min-h-11 text-muted-foreground hover:text-foreground"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="company">Company (leave empty)</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div>
        <label htmlFor="name" className="micro text-muted-foreground">
          Your name
        </label>
        <input
          id="name"
          className={fieldClass}
          placeholder="Full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact" className="micro text-muted-foreground">
          Email or phone
        </label>
        <input
          id="contact"
          className={fieldClass}
          placeholder="you@company.co.za or 082 000 0000"
          autoComplete="email"
          aria-invalid={!!errors.contact}
          {...register("contact")}
        />
        {errors.contact && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.contact.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="service" className="micro text-muted-foreground">
          What is this about? (optional)
        </label>
        <select id="service" className={fieldClass} {...register("service")}>
          <option value="">Not sure yet</option>
          {serviceOptions.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="micro text-muted-foreground">
          In confidence
        </label>
        <textarea
          id="message"
          rows={5}
          className={`${fieldClass} resize-none`}
          placeholder="Tell us what's happening and what you need."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-2 text-xs text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-primary hover:bg-primary/10 disabled:opacity-50"
      >
        {isSubmitting ? "Sending…" : "Send confidentially"}
        <span
          aria-hidden="true"
          className="transition-transform duration-500 group-hover:translate-x-1"
        >
          →
        </span>
      </button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        We use your details only to respond to this enquiry. Read our{" "}
        <a href="/privacy" className="underline underline-offset-4">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
