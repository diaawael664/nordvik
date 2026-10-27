/**
 * Small form-validation helpers shared by contact, account and checkout forms.
 * Each rule returns an error message, or "" when the value is valid.
 */
export type Rule = (value: string, all: Record<string, string>) => string;

export const required =
  (message: string): Rule =>
  (v) =>
    v.trim() ? "" : message;

export const email: Rule = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter an email address like name@example.com.";

export const minLength =
  (n: number, message: string): Rule =>
  (v) =>
    v.trim().length >= n ? "" : message;

export const phone: Rule = (v) =>
  !v.trim() || v.replace(/[^\d]/g, "").length >= 7 ? "" : "Enter a phone number with at least 7 digits.";

/** Card number: 13–19 digits passing the Luhn checksum. */
export const cardNumber: Rule = (v) => {
  const digits = v.replace(/\s/g, "");
  if (!/^\d{13,19}$/.test(digits)) return "Enter the 13–19 digit number on the front of your card.";
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0 ? "" : "This card number isn't valid. Check for a typo.";
};

/** Expiry as MM/YY, not in the past. */
export const expiry: Rule = (v) => {
  const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return "Enter the expiry date as MM/YY.";
  const end = new Date(2000 + Number(m[2]), Number(m[1]), 1);
  return end > new Date() ? "" : "This card has expired.";
};

export const cvc: Rule = (v) => (/^\d{3,4}$/.test(v.trim()) ? "" : "Enter the 3 or 4 digit code on the back.");

export const matches =
  (field: string, message: string): Rule =>
  (v, all) =>
    v === all[field] ? "" : message;

/** Runs `rules` against form values. Returns only fields with errors. */
export function validate(values: Record<string, string>, rules: Record<string, Rule[]>) {
  const errors: Record<string, string> = {};
  for (const [field, list] of Object.entries(rules)) {
    for (const rule of list) {
      const msg = rule(values[field] ?? "", values);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }
  return errors;
}

/**
 * Form-level onChange handler that removes a field's error as soon as the
 * customer edits it, instead of waiting for the next submit.
 */
export const clearErrorOnChange =
  (setErrors: (update: (prev: Record<string, string>) => Record<string, string>) => void) =>
  (e: { target: EventTarget }) => {
    const name = (e.target as HTMLInputElement).name;
    if (!name) return;
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

/** FormData → plain string record. */
export const formValues = (form: HTMLFormElement) =>
  Object.fromEntries([...new FormData(form).entries()].map(([k, v]) => [k, String(v)]));

/** Moves focus to the first invalid field so keyboard and screen-reader users land on it. */
export function focusFirstError(form: HTMLFormElement, errors: Record<string, string>) {
  const first = Object.keys(errors)[0];
  if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
}
