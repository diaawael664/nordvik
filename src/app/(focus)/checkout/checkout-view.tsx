"use client";

import { ArrowLeft, Check, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { site } from "@data/site";
import { Logo } from "@/components/layout/brand";
import { FreeShippingMeter, OrderTotals, PromoForm } from "@/components/cart/order-summary";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field } from "@/components/ui/controls";
import { Photo } from "@/components/ui/photo";
import { useCart } from "@/context/cart-context";
import { track } from "@/lib/analytics";
import { addDemoOrder } from "@/lib/stores";
import { useHydrated } from "@/lib/use-hydrated";
import { cn, formatPrice } from "@/lib/utils";
import {
  cardNumber,
  cvc,
  email,
  expiry,
  focusFirstError,
  formValues,
  phone,
  required,
  validate,
  type Rule,
  clearErrorOnChange,
} from "@/lib/validate";

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Denmark",
  "Germany",
  "Netherlands",
  "Sweden",
  "Australia",
];

const deliveryOptions = [
  { id: "standard", label: "White-glove delivery", note: "Scheduled slot, placed in your room", fee: null },
  { id: "express", label: "Express delivery", note: "In-stock items, within 3 working days", fee: 120 },
] as const;

const paymentOptions = [
  { id: "card", label: "Credit or debit card" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Apple Pay" },
  { id: "instalments", label: "Pay in 3 instalments" },
] as const;

type PaymentId = (typeof paymentOptions)[number]["id"];

/** Groups the card number in fours as the customer types. */
const formatCard = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

/** Formats expiry as MM/YY as the customer types. */
const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const money = (n: number) =>
  new Intl.NumberFormat(site.locale, { style: "currency", currency: site.currency }).format(n);

export function CheckoutView() {
  const hydrated = useHydrated();
  const cart = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [delivery, setDelivery] = useState<(typeof deliveryOptions)[number]["id"]>("standard");
  const [payment, setPayment] = useState<PaymentId>("card");
  const [sameBilling, setSameBilling] = useState(true);
  const [card, setCard] = useState({ number: "", expiry: "" });
  const [order, setOrder] = useState<{ id: string; email: string; total: number } | null>(null);

  const expressFee = deliveryOptions.find((o) => o.id === delivery)?.fee ?? 0;
  const grandTotal = cart.total + expressFee + Math.round(expressFee * site.taxRate * 100) / 100;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const values = formValues(e.currentTarget);
    const rules: Record<string, Rule[]> = {
      email: [required("Enter your email address."), email],
      firstName: [required("Enter your first name.")],
      lastName: [required("Enter your last name.")],
      address: [required("Enter your street address.")],
      city: [required("Enter your town or city.")],
      postcode: [required("Enter your postcode or ZIP code.")],
      phone: [required("Enter a phone number so our drivers can reach you."), phone],
    };
    if (payment === "card") {
      Object.assign(rules, {
        cardName: [required("Enter the name on the card.")],
        cardNumber: [cardNumber],
        cardExpiry: [expiry],
        cardCvc: [cvc],
      });
    }
    if (!sameBilling) {
      Object.assign(rules, {
        billingAddress: [required("Enter your billing address.")],
        billingPostcode: [required("Enter your billing postcode.")],
      });
    }
    const next = validate(values, rules);
    setErrors(next);
    if (Object.keys(next).length) return focusFirstError(e.currentTarget, next);

    // Demo: no payment is taken. Send `values` to your payment provider here.
    const id = `NH-${String(Date.now()).slice(-6)}`;
    track("purchase", {
      transaction_id: id,
      value: grandTotal,
      tax: cart.tax,
      shipping: cart.shipping + expressFee,
      items: cart.lines,
    });
    addDemoOrder({
      id,
      date: new Date().toISOString(),
      total: grandTotal,
      email: values.email,
      delivery: deliveryOptions.find((o) => o.id === delivery)?.label ?? "",
      address: [values.address, values.city, values.postcode, values.country].filter(Boolean).join(", "),
      items: cart.lines.map((l) => ({
        productId: l.productId,
        name: l.product.name,
        quantity: l.quantity,
        variant: [l.color, ...Object.values(l.options ?? {})].filter(Boolean).join(" · "),
        price: l.lineTotal,
      })),
    });
    setOrder({ id, email: values.email, total: grandTotal });
    cart.clear();
    window.scrollTo({ top: 0 });
  };

  const header = (
    <header className="border-b border-line">
      <div className="mx-auto flex h-16 max-w-site items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link href="/cart/" className="flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to cart</span>
        </Link>
        <Logo />
        <span className="flex items-center gap-2 text-xs text-muted">
          <Lock className="size-3.5" /> <span className="hidden sm:inline">Secure checkout</span>
        </span>
      </div>
    </header>
  );

  if (order) {
    return (
      <>
        {header}
        <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-accent text-on-accent">
            <Check className="size-6" />
          </span>
          <p className="eyebrow mt-8">Order {order.id}</p>
          <h1 className="display-md mt-3">Thank you, your order is placed</h1>
          <p className="mt-4 text-muted">
            A confirmation is on its way to <strong className="text-ink">{order.email}</strong>. We&apos;ll email again
            to book your delivery slot as soon as your pieces are ready.
          </p>
          <p className="mt-6 font-display text-2xl">{money(order.total)}</p>
          <p className="mt-2 text-xs text-muted">Demo store: no payment was taken.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={`/account/orders/?id=${order.id}`} size="lg">
              Track your order
            </ButtonLink>
            <ButtonLink href="/shop/" size="lg" variant="outline">
              Continue shopping
            </ButtonLink>
          </div>
        </div>
      </>
    );
  }

  if (hydrated && cart.lines.length === 0) {
    return (
      <>
        {header}
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <h1 className="display-md">Your cart is empty</h1>
          <p className="mt-4 text-muted">Add something to your cart before checking out.</p>
          <ButtonLink href="/shop/" size="lg" className="mt-8">
            Shop all products
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      <div className="mx-auto grid w-full max-w-site flex-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:grid-cols-[minmax(0,1fr)_32rem]">
        <form
          onSubmit={onSubmit}
          onChange={clearErrorOnChange(setErrors)}
          noValidate
          className="space-y-12 px-4 py-10 sm:px-6 lg:px-10 lg:py-14 xl:pr-20"
        >
          <h1 className="display-md">Checkout</h1>

          <Step title="Contact">
            <Field label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
            <label className="mt-4 flex items-center gap-3 text-sm text-muted">
              <input type="checkbox" name="news" className="size-4 accent-[var(--accent)]" />
              Email me about new pieces and offers
            </label>
          </Step>

          <Step title="Delivery address">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" name="firstName" autoComplete="given-name" required error={errors.firstName} />
              <Field label="Last name" name="lastName" autoComplete="family-name" required error={errors.lastName} />
              <Field
                label="Street address"
                name="address"
                autoComplete="street-address"
                required
                error={errors.address}
                className="sm:col-span-2"
              />
              <Field
                label="Apartment, floor, access notes"
                name="address2"
                autoComplete="address-line2"
                className="sm:col-span-2"
                hint="Tell us about stairs or lifts so we send the right team."
              />
              <Field label="Town or city" name="city" autoComplete="address-level2" required error={errors.city} />
              <Field
                label="Postcode / ZIP"
                name="postcode"
                autoComplete="postal-code"
                required
                error={errors.postcode}
              />
              <div>
                <label htmlFor="country" className="mb-2 block text-sm">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="h-12 w-full rounded-base border border-line bg-surface px-3 text-sm outline-none focus:border-ink"
                >
                  {countries.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" required error={errors.phone} />
            </div>
          </Step>

          <Step title="Delivery">
            <ChoiceGroup legend="Delivery speed">
              {deliveryOptions.map((o) => (
                <Choice key={o.id} name="delivery" checked={delivery === o.id} onChange={() => setDelivery(o.id)}>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{o.label}</span>
                    <span className="block text-xs text-muted">{o.note}</span>
                  </span>
                  <span className="font-mono text-sm">
                    {o.fee ? `+${formatPrice(o.fee)}` : cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}
                  </span>
                </Choice>
              ))}
            </ChoiceGroup>
          </Step>

          <Step title="Payment">
            <ChoiceGroup legend="Payment method">
              {paymentOptions.map((o) => (
                <Choice key={o.id} name="payment" checked={payment === o.id} onChange={() => setPayment(o.id)}>
                  <span className="flex-1 text-sm font-medium">{o.label}</span>
                  {o.id === "card" && <CreditCard className="size-5 text-muted" strokeWidth={1.5} />}
                  {o.id === "instalments" && (
                    <span className="font-mono text-xs text-muted">3 × {formatPrice(Math.ceil(grandTotal / 3))}</span>
                  )}
                </Choice>
              ))}
            </ChoiceGroup>

            {payment === "card" ? (
              <div className="mt-6 grid gap-5 border border-line bg-surface p-5 sm:grid-cols-2 sm:p-6">
                <Field
                  label="Name on card"
                  name="cardName"
                  autoComplete="cc-name"
                  required
                  error={errors.cardName}
                  className="sm:col-span-2"
                />
                <Field
                  label="Card number"
                  name="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={card.number}
                  onChange={(e) => setCard((c) => ({ ...c, number: formatCard(e.target.value) }))}
                  required
                  error={errors.cardNumber}
                  hint="Demo: try 4242 4242 4242 4242"
                  className="sm:col-span-2"
                />
                <Field
                  label="Expiry (MM/YY)"
                  name="cardExpiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={(e) => setCard((c) => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  required
                  error={errors.cardExpiry}
                />
                <Field
                  label="Security code"
                  name="cardCvc"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  required
                  error={errors.cardCvc}
                />
              </div>
            ) : (
              <p className="mt-6 border border-line bg-surface p-5 text-sm text-muted">
                You&apos;ll be redirected to complete payment after placing your order.
              </p>
            )}

            <label className="mt-6 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={sameBilling}
                onChange={(e) => setSameBilling(e.target.checked)}
                className="size-4 accent-[var(--accent)]"
              />
              Billing address is the same as delivery
            </label>
            {!sameBilling && (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Billing address"
                  name="billingAddress"
                  autoComplete="billing street-address"
                  required
                  error={errors.billingAddress}
                  className="sm:col-span-2"
                />
                <Field
                  label="Billing postcode"
                  name="billingPostcode"
                  autoComplete="billing postal-code"
                  required
                  error={errors.billingPostcode}
                />
              </div>
            )}
          </Step>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="border-l-2 border-wood bg-surface px-4 py-3 text-sm">
              {Object.keys(errors).length === 1 ? "One field needs" : `${Object.keys(errors).length} fields need`}{" "}
              attention before you can place your order.
            </p>
          )}

          <div className="space-y-4">
            <Button type="submit" size="lg" className="w-full" disabled={!hydrated}>
              Place order — {money(grandTotal)}
            </Button>
            <p className="text-center text-xs text-muted">
              By placing your order you agree to our{" "}
              <Link href="/terms/" className="underline">
                terms of sale
              </Link>
              . Demo store: no payment is taken.
            </p>
          </div>
        </form>

        <aside aria-label="Order summary" className="border-line bg-surface lg:border-l">
          <div className="space-y-6 px-4 py-10 sm:px-6 lg:sticky lg:top-0 lg:px-10 lg:py-14">
            <h2 className="font-display text-2xl">Order summary</h2>
            <ul className="divide-y divide-line">
              {cart.lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-4">
                  <span className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-sand">
                    <Photo name={l.product.images[0]} alt={l.product.name} fill sizes="64px" className="object-cover" />
                    <span className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-ink px-1 font-mono text-[10px] leading-5 text-bg">
                      {l.quantity}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{l.product.name}</span>
                    <span className="block text-xs text-muted">
                      {[l.color, ...Object.values(l.options ?? {})].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="font-mono text-sm">{formatPrice(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <FreeShippingMeter />
            <PromoForm />
            <OrderTotals />
            {expressFee > 0 && (
              <p className="flex justify-between text-sm">
                <span>Express delivery (incl. tax)</span>
                <span className="font-mono">+{money(grandTotal - cart.total)}</span>
              </p>
            )}
            <p className="flex items-baseline justify-between border-t border-line pt-4">
              <span>Amount to pay</span>
              <span className="font-display text-2xl">{money(grandTotal)}</span>
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className="mb-5 font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function ChoiceGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="divide-y divide-line border border-line">{children}</div>
    </fieldset>
  );
}

function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cn("flex cursor-pointer items-center gap-4 px-4 py-4 transition-colors", checked && "bg-surface")}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="size-4 accent-[var(--accent)]" />
      {children}
    </label>
  );
}
