"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { email, focusFirstError, formValues, minLength, required, validate, clearErrorOnChange } from "@/lib/validate";

const topics = ["Product question", "An existing order", "Delivery", "Returns", "Trade & business", "Something else"];

/**
 * Demo contact form: validates on submit and shows a confirmation.
 * To send messages, post `values` to a form service (Formspree, Netlify
 * Forms, your own API) inside `onSubmit`.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = formValues(e.currentTarget);
    const next = validate(values, {
      name: [required("Enter your name.")],
      email: [required("Enter your email address."), email],
      message: [minLength(10, "Write a message of at least 10 characters.")],
    });
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget, next);
    setSentTo(values.email);
    track("generate_lead", { lead_type: "contact", topic: values.topic });
  };

  if (sentTo) {
    return (
      <div className="border border-line bg-surface p-8" role="status">
        <p className="font-display text-3xl">Message sent</p>
        <p className="mt-3 text-muted">
          Thanks for writing. We&apos;ll reply to <strong className="text-ink">{sentTo}</strong> within one working day.
        </p>
        <Button variant="link" className="mt-4" onClick={() => setSentTo(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onChange={clearErrorOnChange(setErrors)} noValidate className="grid gap-6 sm:grid-cols-2">
      <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
      <div>
        <label htmlFor="topic" className="mb-2 block text-sm">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          className="h-12 w-full rounded-base border border-line bg-surface px-3 text-sm outline-none focus:border-ink"
        >
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <Field
        label="Order number"
        name="order"
        placeholder="Optional, e.g. NV-10482"
        hint="Helps us find your order faster."
      />
      <div className="sm:col-span-2">
        <label htmlFor="message" className="mb-2 block text-sm">
          Message{" "}
          <span className="text-muted" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-msg" : undefined}
          className={cn(
            "w-full rounded-base border bg-surface px-4 py-3 text-sm outline-none focus:border-ink",
            errors.message ? "border-wood" : "border-line",
          )}
        />
        {errors.message && (
          <p id="message-msg" className="mt-2 text-xs text-wood">
            {errors.message}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" size="lg">
          Send message
        </Button>
        <p className="text-xs text-muted">We only use your details to reply to this message.</p>
      </div>
    </form>
  );
}
