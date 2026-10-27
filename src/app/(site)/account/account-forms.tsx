"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  email,
  focusFirstError,
  formValues,
  matches,
  minLength,
  required,
  validate,
  clearErrorOnChange,
} from "@/lib/validate";

type Mode = "signin" | "register";

/** Sign in / Register UI (demo). Connect `onSubmit` to your auth provider. */
export function AccountForms() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const switchTo = (m: Mode) => {
    setMode(m);
    setErrors({});
    setDone(null);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = formValues(e.currentTarget);
    const next = validate(
      values,
      mode === "signin"
        ? { email: [required("Enter your email address."), email], password: [required("Enter your password.")] }
        : {
            name: [required("Enter your first name.")],
            email: [required("Enter your email address."), email],
            password: [minLength(8, "Use at least 8 characters.")],
            confirm: [matches("password", "The passwords don't match.")],
          },
    );
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget, next);
    if (mode === "register") track("sign_up", { method: "email" });
    setDone(mode === "signin" ? "You're signed in (demo)." : `Welcome, ${values.name}. Your account is ready (demo).`);
    // Demo: go straight to the account pages. Replace with your auth provider's session handling.
    router.push("/account/orders/");
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      className="flex items-center gap-1 text-xs text-muted hover:text-ink"
      aria-pressed={showPassword}
    >
      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      {showPassword ? "Hide password" : "Show password"}
    </button>
  );

  return (
    <div className="w-full max-w-md">
      <div
        className="mb-10 grid grid-cols-2 border-b border-line"
        role="group"
        aria-label="Choose sign in or create account"
      >
        {(
          [
            ["signin", "Sign in"],
            ["register", "Create account"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => switchTo(m)}
            className={cn(
              "-mb-px border-b py-4 text-sm transition-colors",
              mode === m ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <h1 className="display-md">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-3 mb-8 text-muted">
        {mode === "signin"
          ? "Sign in to see your orders, saved rooms and delivery dates."
          : "Track orders, save your wishlist across devices and get early access to new pieces."}
      </p>

      {done ? (
        <div className="border border-line bg-surface p-6" role="status">
          <p className="font-display text-xl">{done}</p>
          <p className="mt-2 text-sm text-muted">Taking you to your orders…</p>
        </div>
      ) : (
        <form key={mode} onSubmit={onSubmit} onChange={clearErrorOnChange(setErrors)} noValidate className="space-y-5">
          {mode === "register" && (
            <Field label="First name" name="name" autoComplete="given-name" required error={errors.name} />
          )}
          <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
          <Field
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            error={errors.password}
            hint={mode === "register" ? "At least 8 characters." : undefined}
          />
          {mode === "register" && (
            <Field
              label="Confirm password"
              name="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              error={errors.confirm}
            />
          )}
          <div className="flex items-center justify-between">
            {passwordToggle}
            {mode === "signin" && (
              <Link href="/contact/" className="text-xs underline underline-offset-4">
                Forgot password?
              </Link>
            )}
          </div>
          {mode === "register" && (
            <label className="flex items-start gap-3 text-sm text-muted">
              <input type="checkbox" name="news" className="mt-0.5 size-4 accent-[var(--accent)]" />
              Send me new pieces and care guides, about once a month.
            </label>
          )}
          <Button type="submit" size="lg" className="w-full">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      )}
    </div>
  );
}
