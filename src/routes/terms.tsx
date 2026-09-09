import { createFileRoute } from "@tanstack/react-router";
import { EMAIL } from "@/lib/site";

const TITLE = "Terms and conditions — Uthandolwamandla";
const DESCRIPTION =
  "The terms that apply to the use of the Uthandolwamandla Managing and Distribution (Pty) Ltd website and to enquiries made through it.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 pt-36 pb-32 sm:px-12">
      <p className="micro text-muted-foreground">Legal</p>
      <h1 className="display mt-8 text-4xl sm:text-5xl">Terms and conditions</h1>
      <div className="mt-12 space-y-10 text-sm leading-loose text-muted-foreground">
        <section>
          <h2 className="display text-xl text-foreground">Acceptance</h2>
          <p className="mt-3">
            By using this website you agree to these terms. If you do not agree, please do not use
            the site.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Information on this site</h2>
          <p className="mt-3">
            The content describes the services of Uthandolwamandla Managing and Distribution (Pty)
            Ltd in general terms. It is provided for information only and is not legal advice, and
            it should not be relied on in place of advice on your specific circumstances.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">No engagement without agreement</h2>
          <p className="mt-3">
            Sending an enquiry through this site does not create a service relationship between us.
            A mandate begins only once we have agreed the scope, the fees and the terms in writing.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Outcomes</h2>
          <p className="mt-3">
            Statistics referred to on this site, including our success rate in CCMA matters,
            describe past outcomes in matters we have handled. Every matter turns on its own facts
            and no particular result is guaranteed.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Your use of the site</h2>
          <p className="mt-3">
            You may not use the site unlawfully, submit false information, attempt to gain
            unauthorised access, or use automated means to send messages through the contact form.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Intellectual property</h2>
          <p className="mt-3">
            The name, logo, text and design of this site belong to Uthandolwamandla Managing and
            Distribution (Pty) Ltd and may not be reproduced without written permission.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Liability</h2>
          <p className="mt-3">
            To the extent permitted by law, we are not liable for any loss arising from the use of,
            or reliance on, the content of this site or from its temporary unavailability.
          </p>
        </section>
        <section>
          <h2 className="display text-xl text-foreground">Governing law</h2>
          <p className="mt-3">
            These terms are governed by the laws of the Republic of South Africa. Questions may be
            sent to{" "}
            <a href={`mailto:${EMAIL}`} className="text-foreground underline underline-offset-4">
              {EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
