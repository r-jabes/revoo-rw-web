"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { models } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";

type Status = "idle" | "sent" | "error";

/**
 * Enquiry / test-ride form shell. Phase 5: visual + basic required fields.
 * Phase 6 adds full validation, honeypot and a real submission endpoint.
 * Until then, submit stays on-page and shows a prototype acknowledgement.
 */
export function EnquiryForm({ defaultModel = "" }: { defaultModel?: string }) {
  const [model, setModel] = useState(defaultModel);
  const [status, setStatus] = useState<Status>("idle");
  const [testRide, setTestRide] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("model");
    if (m && models.some((x) => x.slug === m)) setModel(m);
    if (window.location.hash.includes("test-ride")) setTestRide(true);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const chosen = String(fd.get("model") ?? "").trim();
    if (!name || (!email && !phone) || !chosen) {
      setStatus("error");
      return;
    }
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-[color:var(--line)] px-6 py-10 md:px-8"
        tabIndex={-1}
        ref={(el) => el?.focus()}
      >
        <p className="t-label text-[color:var(--accent-text)]">Received</p>
        <h3 className="t-display t-h2 mt-4">Thank you.</h3>
        <p className="t-body mt-5 max-w-md text-[color:var(--muted)]">
          {PROTOTYPE
            ? "This is a design prototype: your message was not sent to REVOO. At launch, enquiries will reach the Rwanda team."
            : "A REVOO Rwanda advisor will follow up shortly."}
        </p>
        <Button type="button" variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby={status === "error" ? "form-error" : undefined}>
      {status === "error" && (
        <p id="form-error" role="alert" className="text-[0.9375rem] font-medium text-[color:var(--alert)]">
          Please add your name, a model of interest, and either an email or a phone number.
        </p>
      )}

      <Input name="name" label="Full name" autoComplete="name" required />

      <div className="grid gap-8 sm:grid-cols-2">
        <Input name="email" type="email" label="Email" autoComplete="email" hint="Email or phone is enough." />
        <Input name="phone" type="tel" label="Phone" autoComplete="tel" hint="Rwanda numbers preferred." />
      </div>

      <Select
        name="model"
        label="Model of interest"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        required
      >
        <option value="">Select a model</option>
        {models.map((m) => (
          <option key={m.slug} value={m.slug}>
            REVOO {m.code} — {m.tagline}
          </option>
        ))}
        <option value="unsure">Not sure yet</option>
      </Select>

      <fieldset>
        <legend className="t-label mb-3 text-[color:var(--muted)]">Interest</legend>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="testRide"
            checked={testRide}
            onChange={(e) => setTestRide(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[color:var(--color-green)]"
          />
          <span>
            <span className="block font-medium">I want to book a test ride</span>
            <span className="mt-1 block text-[0.8125rem] text-[color:var(--muted)]">
              We will confirm availability at the Remera branch.
            </span>
          </span>
        </label>
      </fieldset>

      <Textarea name="message" label="Message" hint="Anything we should know before we call you back." />

      {PROTOTYPE && (
        <p className="text-[0.8125rem] text-[color:var(--muted)]">
          Prototype mode: submitting shows a confirmation only. No data leaves this browser.
        </p>
      )}

      <Button type="submit">Send enquiry</Button>
    </form>
  );
}
