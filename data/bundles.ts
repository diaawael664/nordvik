/**
 * "COMPLETE THE LOOK" SETS
 * When every product in a set is in the cart, `percent` comes off one of each.
 * Sets appear on the product page of every product they include.
 */
export type Bundle = {
  id: string;
  title: string;
  /** Product slugs. */
  products: string[];
  percent: number;
};

export const bundles: Bundle[] = [
  {
    id: "reading-corner",
    title: "The reading corner",
    products: ["vinge-lounge-chair", "beam-floor-lamp", "ask-stool"],
    percent: 10,
  },
  {
    id: "living-room",
    title: "The living room",
    products: ["fjell-three-seat-sofa", "atlas-wool-rug", "nook-side-cabinet"],
    percent: 8,
  },
  {
    id: "dining",
    title: "The dining set",
    products: ["rund-dining-table", "hedda-dining-chair", "halo-pendant"],
    percent: 10,
  },
  {
    id: "bedside",
    title: "The bedside",
    products: ["natt-nightstand", "strand-linen-cushion", "mint-ceramic-planter"],
    percent: 10,
  },
  {
    id: "work-corner",
    title: "The work corner",
    products: ["svev-wall-desk", "luna-desk-lamp", "alva-desk-chair"],
    percent: 10,
  },
  {
    id: "bedroom",
    title: "The bedroom",
    products: ["ro-platform-bed", "morgon-bedside-table", "strand-linen-cushion"],
    percent: 8,
  },
];
