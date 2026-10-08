import { createFileRoute } from "@tanstack/react-router";
import { ADDRESS, EMAIL, prettyPhone } from "@/lib/site";

const TITLE = "Privacy policy — Uthandolwamandla";
const DESCRIPTION =
  "How Uthandolwamandla Managing and Distribution (Pty) Ltd collects, uses, stores and protects personal information under POPIA.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "/privacy" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 pt-36 pb-32 sm:px-12">
      <p className="micro text-muted-foreground">Legal</p>
      <h1 className="display mt-8 text-4xl sm:text-5xl">Privacy policy</h1>
      <div className="mt-12 space-y-10 text-sm leading-loose text-muted-foreground">
        <section>
          <h2 className="display text-xl text-foreground">Who we are</h2>
          <p className="mt-3">
            Uthandolwamandla Managing and Distribution (Pty) Ltd, of {ADDRESS}, is the responsible
            party for the personal information described here, as contemplated by the Protection of
            Personal Information Act, 2013 (POPIA).
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">What we collect</h2>
          <p className="mt-3">
            When you contact us through this website we collect the name, email address or phone
            number and message you provide, the service you select, and basic technical information
            (your network address and browser signature) used solely to prevent automated abuse of
            the form.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Why we use it</h2>
          <p className="mt-3">
            To respond to your enquiry, to provide the services you ask for, and to keep records
            required by law. We do not sell your information and we do not use it for marketing
            unless you ask us to.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Who can see it</h2>
          <p className="mt-3">
            Messages sent through this website are stored in a private database that cannot be read
            from the public website. Access is limited to authorised members of our team and, where
            required, to our service providers who process data on our instructions, and to
            regulators or forums such as the CCMA where the law or a matter requires it.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">How long we keep it</h2>
          <p className="mt-3">
            We keep enquiry records for as long as needed to deal with the matter and to meet legal
            record-keeping obligations, after which they are deleted or anonymised.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Security</h2>
          <p className="mt-3">
            The site is served over HTTPS and information is transmitted encrypted. We apply
            reasonable technical and organisational measures to protect personal information
            against loss, unauthorised access and disclosure.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Your rights</h2>
          <p className="mt-3">
            You may ask us what personal information we hold about you, ask us to correct or delete
            it, or object to how we use it. Write to{" "}
            <a href={`mailto:${EMAIL}`} className="text-foreground underline underline-offset-4">
              {EMAIL}
            </a>{" "}
            or call {prettyPhone("+27738583423")}. You also have the right to complain to the
            Information Regulator of South Africa.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Cookies and analytics</h2>
          <p className="mt-3">
            This site sets no advertising cookies. If website analytics are enabled in future, they
            will be used only to understand aggregate visits, and this policy will be updated
            before that happens.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Changes</h2>
          <p className="mt-3">
            We may update this policy from time to time. The version published on this page is the
            one that applies.
          </p>
        </section>
      </div>
    </article>
  );
}
