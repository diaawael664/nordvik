"use client";

import { Truck } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { OptionGroup, QuantityStepper, SwatchGroup } from "@/components/ui/controls";
import { Price, Rating } from "@/components/ui/primitives";
import { unitPrice, useCart } from "@/context/cart-context";
import { useUI } from "@/context/ui-context";
import { formatPrice } from "@/lib/utils";
import { defaultSelection } from "./product-card";
import { BackInStock, DeliveryEstimate, SwatchRequest } from "./product-extras";
import { WishlistButton } from "./wishlist-button";

/** Color, option and quantity state for one product. */
export function useProductSelection(product: Product) {
  const initial = defaultSelection(product);
  const [color, setColor] = useState(initial.color);
  const [options, setOptions] = useState<Record<string, string>>(initial.options);
  const [quantity, setQuantity] = useState(1);
  return {
    color,
    setColor: (name: string) => setColor(name),
    options,
    setOption: (name: string, value: string) => setOptions((o) => ({ ...o, [name]: value })),
    quantity,
    setQuantity,
    price: unitPrice(product, options),
  };
}

export type ProductSelection = ReturnType<typeof useProductSelection>;

type PurchasePanelProps = {
  product: Product;
  selection: ProductSelection;
  /** Called after a successful add (quick view uses it to close itself). */
  onAdded?: () => void;
  /** Show delivery estimate and swatch ordering (product page only). */
  extras?: boolean;
};

/** Variant pickers, quantity and add-to-cart. Shared by quick view and the product page. */
export function PurchasePanel({ product, selection, onAdded, extras = false }: PurchasePanelProps) {
  const { add } = useCart();
  const { open, notify } = useUI();
  const soldOut = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const priceDelta = selection.price - product.price;

  const onAdd = () => {
    add({
      productId: product.id,
      color: selection.color,
      options: selection.options,
      quantity: selection.quantity,
    });
    notify(`Added ${product.name} to your cart`);
    onAdded?.();
    open("cart");
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Price
          price={selection.price}
          compareAt={product.compareAt ? product.compareAt + priceDelta : undefined}
          size="lg"
          className="font-display"
        />
        {product.reviewCount > 0 && <Rating value={product.rating} count={product.reviewCount} />}
      </div>

      {product.colors.length > 0 && (
        <SwatchGroup colors={product.colors} value={selection.color} onChange={selection.setColor} />
      )}

      {product.options?.map((opt) => (
        <OptionGroup
          key={opt.name}
          legend={opt.name}
          value={selection.options[opt.name]}
          onChange={(v) => selection.setOption(opt.name, v)}
          options={opt.values.map((v) => ({
            label: v.label,
            note: v.priceDelta ? `+${formatPrice(v.priceDelta)}` : undefined,
          }))}
        />
      ))}

      {soldOut ? (
        <div className="space-y-3">
          <BackInStock product={product} />
          <WishlistButton productId={product.id} productName={product.name} variant="full" className="w-full" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <QuantityStepper
            value={selection.quantity}
            onChange={selection.setQuantity}
            max={Math.max(1, product.stock)}
          />
          <Button size="lg" className="min-w-48 flex-1" onClick={onAdd}>
            Add to cart — {formatPrice(selection.price * selection.quantity)}
          </Button>
          <WishlistButton productId={product.id} productName={product.name} variant="full" />
        </div>
      )}

      <p className="flex items-center gap-2 text-sm text-muted">
        <Truck className="size-4 shrink-0" strokeWidth={1.5} />
        {soldOut
          ? product.leadTime
          : lowStock
            ? `Only ${product.stock} left — ${product.leadTime.toLowerCase()}`
            : product.leadTime}
      </p>
      {extras && (
        <div className="-mt-3 space-y-4">
          <DeliveryEstimate product={product} />
          <SwatchRequest product={product} />
        </div>
      )}
    </div>
  );
}
