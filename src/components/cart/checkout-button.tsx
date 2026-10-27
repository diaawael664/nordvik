"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { track } from "@/lib/analytics";
import { startCheckout } from "@/lib/commerce";

/** Checkout button for the mini cart and cart page; follows `site.checkoutMode`. */
export function CheckoutButton({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { lines, total } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const go = async () => {
    setBusy(true);
    setError("");
    track("begin_checkout", { value: total, items: lines });
    try {
      const result = await startCheckout(lines);
      onNavigate?.();
      if (result.type === "redirect") window.location.assign(result.url);
      else router.push(result.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout is unavailable. Try again in a moment.");
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <Button size="lg" className="w-full" onClick={go} disabled={busy || lines.length === 0}>
        {busy && <Loader2 className="size-4 animate-spin" />}
        Checkout
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-wood">
          {error}
        </p>
      )}
    </div>
  );
}
