"use client";

import { Plus } from "lucide-react";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { sampleAddresses, type Address } from "@data/account";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { createPersistentStore } from "@/lib/persistent-store";
import { clearErrorOnChange, focusFirstError, formValues, required, validate } from "@/lib/validate";
import { AccountShell } from "../account-shell";

const store = createPersistentStore<Address[]>("nordvik:addresses", sampleAddresses);

/** Saved addresses (demo: kept in the browser). */
export function AddressesView() {
  const addresses = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  const [adding, setAdding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = formValues(e.currentTarget);
    const next = validate(v, {
      label: [required("Name this address, e.g. Home.")],
      name: [required("Enter the recipient's name.")],
      street: [required("Enter the street address.")],
      city: [required("Enter the town or city.")],
      postcode: [required("Enter the postcode or ZIP code.")],
    });
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget, next);
    store.set((prev) => [
      ...prev,
      { id: String(Date.now()), label: v.label, lines: [v.name, v.street, `${v.city}, ${v.postcode}`] },
    ]);
    setAdding(false);
  };

  const makeDefault = (id: string) => store.set((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  const remove = (id: string) => store.set((prev) => prev.filter((a) => a.id !== id));

  return (
    <AccountShell title="Your addresses">
      <ul className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <li key={a.id} className="flex flex-col border border-line p-6">
            <p className="flex items-center gap-2 font-medium">
              {a.label}
              {a.isDefault && <span className="rounded-full bg-sand px-2 py-0.5 text-xs font-normal">Default</span>}
            </p>
            <address className="mt-3 flex-1 text-sm leading-relaxed text-muted not-italic">
              {a.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <div className="mt-5 flex gap-4 text-xs">
              {!a.isDefault && (
                <button type="button" onClick={() => makeDefault(a.id)} className="underline underline-offset-4">
                  Make default
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(a.id)}
                className="text-muted underline underline-offset-4 hover:text-ink"
                aria-label={`Remove ${a.label} address`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
        {!adding && (
          <li>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-full min-h-44 w-full flex-col items-center justify-center gap-2 border border-dashed border-line text-sm transition-colors hover:border-ink"
            >
              <Plus className="size-5" strokeWidth={1.5} /> Add an address
            </button>
          </li>
        )}
      </ul>

      {adding && (
        <form
          onSubmit={onSubmit}
          onChange={clearErrorOnChange(setErrors)}
          noValidate
          className="mt-8 grid gap-5 border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8"
        >
          <h2 className="font-display text-2xl sm:col-span-2">New address</h2>
          <Field label="Label" name="label" placeholder="Home, Office…" required error={errors.label} />
          <Field label="Recipient" name="name" autoComplete="name" required error={errors.name} />
          <Field
            label="Street address"
            name="street"
            autoComplete="street-address"
            required
            error={errors.street}
            className="sm:col-span-2"
          />
          <Field label="Town or city" name="city" autoComplete="address-level2" required error={errors.city} />
          <Field label="Postcode / ZIP" name="postcode" autoComplete="postal-code" required error={errors.postcode} />
          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit">Save address</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </AccountShell>
  );
}
