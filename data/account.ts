/**
 * DEMO ACCOUNT
 * Sample customer, orders and addresses shown in /account/ pages. Orders placed
 * in the demo checkout are added on top (stored in the visitor's browser).
 * Replace with data from your platform's customer API.
 */
export const demoCustomer = { firstName: "Astrid", email: "astrid@example.com" };

/** Delivery stages, in order. `status` on an order is an index into this list. */
export const orderStages = ["Order placed", "Being made", "Shipped", "Out for delivery", "Delivered"] as const;

export type SampleOrder = {
  id: string;
  date: string;
  status: number;
  /** Product slug and quantity. */
  items: { slug: string; quantity: number }[];
  total: number;
  carrier?: { name: string; tracking: string };
};

export const sampleOrders: SampleOrder[] = [
  {
    id: "NH-208341",
    date: "2026-10-09",
    status: 2,
    items: [
      { slug: "orbit-swivel-chair", quantity: 1 },
      { slug: "beam-floor-lamp", quantity: 1 },
    ],
    total: 1112.4,
    carrier: { name: "Nordhaus Delivery", tracking: "NHD-55-0193-4" },
  },
  {
    id: "NH-196027",
    date: "2026-07-22",
    status: 4,
    items: [
      { slug: "lund-dining-chair", quantity: 4 },
      { slug: "rund-dining-table", quantity: 1 },
    ],
    total: 1874.88,
  },
];

export type Address = { id: string; label: string; lines: string[]; isDefault?: boolean };

export const sampleAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    lines: ["Astrid Lindqvist", "45 Harbor Lane, Apt 3", "Brooklyn, NY 11249"],
    isDefault: true,
  },
  { id: "studio", label: "Studio", lines: ["Astrid Lindqvist", "12 Mill Street", "Hudson, NY 12534"] },
];
