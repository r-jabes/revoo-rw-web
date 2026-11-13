"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { models } from "@/data/models";
import { PROTOTYPE } from "@/lib/flags";
import {
  emptyEnquiry,
  readEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryValues,
} from "@/lib/validate";

type Status = "idle" | "submitting" | "sent";

/**
 * Enquiry / test-ride form.
 * Phase 6: per-field validation, honeypot, focus management, keyboard/screen-reader states.
 * Prototype mode never posts — success is local only.
 */
export function EnquiryForm({ defaultModel = "" }: { defaultModel?: string }) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<EnquiryValues>(() => ({
    ...emptyEnquiry(),
    model: defaultModel,
  }));
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryValues, boolean>>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("model");
    setValues((cur) => {
      const next = { ...cur };
      if (m && (models.some((x) => x.slug === m) || m === "unsure")) next.model = m;
      if (window.location.hash.includes("test-ride")) next.testRide = true;
      return next;
    });
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const setField = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    setValues((cur) => ({ ...cur, [key]: value }));
    if (touched[key] || errors[key]) {
      const next = { ...values, [key]: value };
      const e = validateEnquiry(next);
      setErrors((cur) => {
        const merged = { ...cur, [key]: e[key] };
        if (!e[key]) delete merged[key];
        if (Object.keys(merged).filter((k) => k !== "form").length === 0) delete merged.form;
        else if (e.form && e.form !== "spam") merged.form = e.form;
        return merged;
      });
    }
  };

  const onBlur = (key: keyof EnquiryValues) => {
    setTouched((t) => ({ ...t, [key]: true }));
    const e = validateEnquiry(values);
    setErrors((cur) => {
      const next = { ...cur };
      if (e[key]) next[key] = e[key];
      else delete next[key];
      return next;
    });
  };

  const focusFirstError = (e: EnquiryErrors) => {
    const order: (keyof EnquiryValues)[] = ["name", "email", "phone", "model", "message"];
    const first = order.find((k) => e[k]);
    if (!first || !formRef.current) return;
    const el = formRef.current.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const next = readEnquiry(fd);
    // Preserve controlled checkbox / model if FormData oddities
    next.testRide = values.testRide;
    next.model = values.model;
    setValues(next);
    setTouched({ name: true, email: true, phone: true, model: true, message: true });

    const eMap = validateEnquiry(next);
    if (eMap.form === "spam") {
      // Silent success for bots
      setStatus("sent");
      setErrors({});
      return;
    }
    if (Object.keys(eMap).length) {
      setErrors(eMap);
      setStatus("idle");
      // Defer focus so alert is in the DOM for SR
      requestAnimationFrame(() => focusFirstError(eMap));
      return;
    }

    setErrors({});
    setStatus("submitting");
    // Prototype: no network. Real endpoint lands at launch.
    window.setTimeout(() => setStatus("sent"), 280);
  };

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        role="status"
        aria-live="polite"
        className="border border-[color:var(--line)] px-6 py-10 outline-none md:px-8"
        tabIndex={-1}
      >
        <p className="t-label text-[color:var(--accent-text)]">Received</p>
        <h3 className="t-display t-h2 mt-4">Thank you.</h3>
        <p className="t-body mt-5 max-w-md text-[color:var(--muted)]">
          {PROTOTYPE
            ? "This is a design prototype: your message was not sent to REVOO. At launch, enquiries will reach the Rwanda team."
            : "A REVOO Rwanda advisor will follow up shortly."}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-8"
          onClick={() => {
            setStatus("idle");
            setValues({ ...emptyEnquiry(), testRide: true });
            setErrors({});
            setTouched({});
          }}
        >
          Send another
        </Button>
      </div>
    );
  }

  const errorSummaryId = `${formId}-summary`;
  const hasFieldErrors = Object.keys(errors).some((k) => k !== "form" && errors[k as keyof EnquiryErrors]);

  return (
    <form
      ref={formRef}
      id={formId}
      onSubmit={onSubmit}
      noValidate
      className="space-y-8"
      aria-describedby={hasFieldErrors ? errorSummaryId : undefined}
    >
      {hasFieldErrors && (
        <div
          id={errorSummaryId}
          role="alert"
          tabIndex={-1}
          className="border border-[color:var(--alert)] px-4 py-3 text-[0.9375rem] font-medium text-[color:var(--alert)]"
        >
          {errors.form ?? "Please fix the highlighted fields and try again."}
        </div>
      )}

      {/* Honeypot: hidden from users, filled by naive bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => setField("company", e.target.value)}
        />
      </div>

      <Input
        name="name"
        label="Full name"
        autoComplete="name"
        required
        value={values.name}
        onChange={(e) => setField("name", e.target.value)}
        onBlur={() => onBlur("name")}
        error={errors.name}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Input
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          inputMode="email"
          hint="Email or phone is enough."
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          onBlur={() => onBlur("email")}
          error={errors.email}
        />
        <Input
          name="phone"
          type="tel"
          label="Phone"
          autoComplete="tel"
          inputMode="tel"
          hint="Rwanda numbers preferred."
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          onBlur={() => onBlur("phone")}
          error={errors.phone}
        />
      </div>

      <Select
        name="model"
        label="Model of interest"
        value={values.model}
        onChange={(e) => setField("model", e.target.value)}
        onBlur={() => onBlur("model")}
        required
        error={errors.model}
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
        <label className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="testRide"
            checked={values.testRide}
            onChange={(e) => setField("testRide", e.target.checked)}
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

      <Textarea
        name="message"
        label="Message"
        hint="Anything we should know before we call you back."
        value={values.message}
        onChange={(e) => setField("message", e.target.value)}
        onBlur={() => onBlur("message")}
        error={errors.message}
      />

      {PROTOTYPE && (
        <p className="text-[0.8125rem] text-[color:var(--muted)]">
          Prototype mode: submitting shows a confirmation only. No data leaves this browser.
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"} aria-busy={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </Button>
    </form>
  );
}
