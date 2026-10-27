"use client";

import { useState } from "react";
import type { ProductColor } from "@/lib/catalog";
import { Field, OptionGroup, QuantityStepper, SwatchGroup } from "@/components/ui/controls";

const colors: ProductColor[] = [
  { name: "Pine velvet", hex: "#2F4A3E", family: "Green" },
  { name: "Oat bouclé", hex: "#D8CCB8", family: "Beige" },
  { name: "Charcoal wool", hex: "#3A3633", family: "Gray" },
];

/** Live form controls for the Elements page. */
export function InteractiveDemo() {
  const [color, setColor] = useState(colors[0].name);
  const [size, setSize] = useState("3-seat");
  const [qty, setQty] = useState(1);
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="space-y-8">
        <SwatchGroup colors={colors} value={color} onChange={setColor} />
        <OptionGroup
          legend="Configuration"
          value={size}
          onChange={setSize}
          options={[
            { label: "3-seat" },
            { label: "Corner, left", note: "+$640" },
            { label: "Corner, right", note: "+$640" },
          ]}
        />
        <QuantityStepper value={qty} onChange={setQty} />
      </div>
      <div className="space-y-5">
        <Field label="Full name" placeholder="Astrid Lindqvist" required />
        <Field label="Email" type="email" placeholder="name@example.com" hint="We send order updates here." />
        <Field label="Postcode" defaultValue="1000" error="Enter a 5-digit postcode, e.g. 11211." />
      </div>
    </div>
  );
}
