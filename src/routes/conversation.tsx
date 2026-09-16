import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Reveal";
import { ADDRESS, CONTACTS, EMAIL, prettyPhone, whatsappLink } from "@/lib/site";

const TITLE = "Start a confidential conversation — Uthandolwamandla";
const DESCRIPTION =
  "Speak to Uthandolwamandla in confidence about recruitment, HR, a CCMA matter, payroll, training or health & safety. Message, WhatsApp or call our team directly.";

export const Route = createFileRoute("/conversation")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/conversation" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/conversation" }],
  }),
  component: ConversationPage,
});

function ConversationPage() {
  const waText = "Hello Uthandolwamandla, I'd like to speak in confidence about an HR matter.";

  return (
    <div className="px-6 pt-36 pb-32 sm:px-12">
      <div className="mx-auto grid max-w-5xl gap-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <p className="micro text-muted-foreground">In confidence</p>
            <h1 className="display mt-8 text-4xl text-balance sm:text-6xl">
              Tell us what's happening.
            </h1>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
              Everything you send is treated as confidential and read only by our team. If the
              matter is urgent, WhatsApp or call — someone will answer.
            </p>
          </Reveal>

          <Reveal delay={220} className="mt-16">
            <ContactForm />
          </Reveal>
        </div>

        <aside className="space-y-12">
          <Reveal delay={140}>
            <p className="micro text-muted-foreground">Speak to someone now</p>
            <ul className="mt-6 space-y-6">
              {CONTACTS.map((c) => (
                <li key={c.phone} className="border-b border-border pb-6">
                  <p className="text-sm text-foreground">{c.name}</p>
                  <p className="micro mt-1 text-muted-foreground">{c.role}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <a
                      href={`tel:${c.phone}`}
                      className="inline-flex min-h-11 items-center text-foreground underline-offset-4 hover:underline"
                    >
                      Call {prettyPhone(c.phone)}
                    </a>
                    <a
                      href={whatsappLink(c.phone, waText)}
                      className="inline-flex min-h-11 items-center text-primary-glow underline-offset-4 hover:underline"
                    >
                      WhatsApp
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={280}>
            <p className="micro text-muted-foreground">Email</p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-3 block text-sm text-foreground underline-offset-4 hover:underline"
            >
              {EMAIL}
            </a>
            <p className="micro mt-10 text-muted-foreground">Office</p>
            <p className="mt-3 text-sm text-muted-foreground">{ADDRESS}</p>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
