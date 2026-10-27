/**
 * FREQUENTLY ASKED QUESTIONS
 * Grouped by topic. Answers are plain text; line breaks are kept.
 */
export type FaqGroup = { topic: string; items: { q: string; a: string }[] };

export const faq: FaqGroup[] = [
  {
    topic: "Orders & delivery",
    items: [
      {
        q: "How long will my order take to arrive?",
        a: "Each product page shows its lead time. In-stock pieces ship within 2–4 working days; made-to-order pieces take 4–6 weeks. We'll email you to book a delivery slot once your order is ready.",
      },
      {
        q: "How much does delivery cost?",
        a: "Delivery is free on orders over $750 and includes carrying your order to the room of your choice, unpacking it and taking the packaging away. Smaller orders ship for a flat $49.",
      },
      {
        q: "Will it fit through my door?",
        a: "Check the Dimensions tab on the product page and measure your doorways, stairwells and lifts. Most sofas fit through a 76 cm doorway. If you're unsure, email us your measurements and we'll check for you.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "Yes, free of charge until your order is dispatched. Made-to-order pieces can be changed within 48 hours of ordering.",
      },
    ],
  },
  {
    topic: "Returns & warranty",
    items: [
      {
        q: "What is the 100-night trial?",
        a: "Live with your piece for up to 100 nights. If it isn't right, tell us and we'll collect it for free and refund you in full. Made-to-order pieces can be returned within 30 days.",
      },
      {
        q: "What does the warranty cover?",
        a: "Frames, joints and drawer runners are covered for 10 years. Upholstery and finishes are covered for 2 years against manufacturing faults.",
      },
      {
        q: "Can I buy replacement covers or parts?",
        a: "Yes. We keep spare covers, cushions, legs and hardware for every design we've sold. Contact our team with your order number.",
      },
    ],
  },
  {
    topic: "Products & care",
    items: [
      {
        q: "Where is your furniture made?",
        a: "Our frames are built in our Copenhagen workshop. Some textiles and ceramics are made by partner studios in Portugal and Lithuania, which we visit every year.",
      },
      {
        q: "How do I care for oiled oak?",
        a: "Wipe with a damp cloth and dry straight away. Re-oil once or twice a year with the care kit included with every oak piece. Use coasters for hot dishes.",
      },
      {
        q: "Can I see fabric swatches before ordering?",
        a: "Yes. Order up to six free swatches from any product page, or visit one of our showrooms to see the full range.",
      },
    ],
  },
  {
    topic: "Payment",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "Visa, Mastercard, American Express, PayPal, Apple Pay and Google Pay. All payments are encrypted.",
      },
      {
        q: "Do you offer payment in instalments?",
        a: "Yes, on orders over $500 you can split the cost into 3, 6 or 12 monthly payments at checkout, subject to approval.",
      },
    ],
  },
];
