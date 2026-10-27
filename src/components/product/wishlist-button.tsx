"use client";

import { Heart } from "lucide-react";
import { useUI } from "@/context/ui-context";
import { useWishlist } from "@/context/wishlist-context";
import { cn } from "@/lib/utils";

type WishlistButtonProps = {
  productId: string;
  productName: string;
  className?: string;
  /** "icon" for cards, "full" for the product page. */
  variant?: "icon" | "full";
};

export function WishlistButton({ productId, productName, className, variant = "icon" }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const { notify } = useUI();
  const saved = has(productId);

  const onClick = () => {
    toggle(productId);
    notify(saved ? `Removed ${productName} from your wishlist` : `Saved ${productName} to your wishlist`);
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 border border-line px-5 text-sm transition-colors hover:border-ink",
          className,
        )}
      >
        <Heart className={cn("size-4", saved && "fill-wood text-wood")} strokeWidth={1.5} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cn(
        "grid size-10 place-items-center rounded-full bg-bg/85 backdrop-blur transition-colors hover:bg-bg",
        className,
      )}
    >
      <Heart
        className={cn("size-[18px] transition-transform active:scale-75", saved && "fill-wood text-wood")}
        strokeWidth={1.5}
      />
    </button>
  );
}
