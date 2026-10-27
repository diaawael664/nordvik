/**
 * LEGAL & POLICY PAGES
 * ─────────────────────────────────────────────────────────────────────────────
 * Starting templates for /privacy/, /terms/, /cookies/ and /shipping-returns/.
 * They are written for a typical online furniture store but are NOT legal
 * advice: have them reviewed for your business and the countries you sell to
 * (for example GDPR in the EU/UK, CCPA in California) before launch.
 *
 * `{store}`, `{email}` and `{url}` are replaced with values from data/site.ts.
 */

export type LegalSection = { id: string; heading: string; body: string[] };

export type LegalPage = {
  slug: "privacy" | "terms" | "cookies" | "shipping-returns";
  title: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    description: "How {store} collects, uses and protects your personal information.",
    updated: "2026-10-27",
    intro:
      "This policy explains what personal information {store} collects when you visit {url} or buy from us, why we collect it, and the choices you have.",
    sections: [
      {
        id: "what-we-collect",
        heading: "Information we collect",
        body: [
          "Information you give us: your name, email address, phone number, delivery and billing addresses, order details and any messages you send us.",
          "Payment information is entered directly with our payment provider. We never see or store your full card number.",
          "Information collected automatically, with your consent: pages you visit, products you view and the device and browser you use. See our cookie policy for details.",
        ],
      },
      {
        id: "how-we-use",
        heading: "How we use it",
        body: [
          "To process and deliver your orders, book delivery slots and handle returns and warranty claims.",
          "To answer your questions and send service messages about your order.",
          "To send our newsletter, only if you subscribe. Every email has a one-click unsubscribe link.",
          "To understand how the site is used and improve it, only if you accept analytics cookies.",
        ],
      },
      {
        id: "sharing",
        heading: "Who we share it with",
        body: [
          "We share only what's needed with the companies that help us run the store: our payment provider, delivery partners, email service and website hosting.",
          "We do not sell your personal information.",
          "We may disclose information if the law requires it.",
        ],
      },
      {
        id: "retention",
        heading: "How long we keep it",
        body: [
          "Order records are kept for as long as tax and consumer law require, usually up to seven years.",
          "Newsletter details are kept until you unsubscribe. Account details are kept until you ask us to delete your account.",
        ],
      },
      {
        id: "your-rights",
        heading: "Your rights",
        body: [
          "You can ask to see, correct, export or delete the personal information we hold about you, and object to or limit how we use it.",
          "Email {email} and we'll reply within 30 days. You can also complain to your local data protection authority.",
        ],
      },
      {
        id: "contact",
        heading: "Contact",
        body: ["Questions about this policy: {email}."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    description: "The terms that apply when you buy from {store}.",
    updated: "2026-10-27",
    intro: "These terms apply to every order placed on {url}. By placing an order, you agree to them.",
    sections: [
      {
        id: "orders",
        heading: "Orders and contracts",
        body: [
          "Your order is an offer to buy. A contract is formed when we email you to confirm that your order has been accepted.",
          "We may decline an order, for example if an item is out of stock or a price was shown incorrectly. If we do, we'll refund any payment in full.",
        ],
      },
      {
        id: "prices",
        heading: "Prices and payment",
        body: [
          "Prices are shown in the store's currency and include the product only. Delivery charges and any applicable taxes are shown before you pay.",
          "Payment is taken when your order is placed. Instalment plans are provided by a third party and subject to its approval and terms.",
        ],
      },
      {
        id: "made-to-order",
        heading: "Made-to-order pieces",
        body: [
          "Made-to-order pieces are built for you once your order is confirmed. They can be changed within 48 hours of ordering and returned within 30 days of delivery.",
          "Natural materials such as wood, leather and linen vary in grain and color, which is part of their character and not a fault.",
        ],
      },
      {
        id: "delivery",
        heading: "Delivery",
        body: [
          "Delivery times shown on product pages are estimates. We'll contact you to book a delivery slot once your order is ready.",
          "Please make sure your piece will fit through doorways, stairwells and lifts. If delivery isn't possible because of access, we'll offer a return.",
        ],
      },
      {
        id: "returns",
        heading: "Returns and warranty",
        body: [
          "Our returns policy and warranty are described on the shipping and returns page. They are in addition to your statutory rights, which are not affected.",
        ],
      },
      {
        id: "liability",
        heading: "Liability",
        body: [
          "We are responsible for losses that are a foreseeable result of our breaking these terms. We are not responsible for losses that were not foreseeable, or for business losses.",
          "Nothing in these terms limits liability that cannot be limited by law.",
        ],
      },
      {
        id: "law",
        heading: "Governing law",
        body: [
          "These terms are governed by the laws of the country in which {store} is registered. Replace this sentence with your jurisdiction.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    description: "Which cookies {store} uses and how to change your choice.",
    updated: "2026-10-27",
    intro:
      "Cookies and similar browser storage help the site work and, with your permission, help us understand how it's used. You can change your choice at any time with the button below.",
    sections: [
      {
        id: "necessary",
        heading: "Strictly necessary",
        body: [
          "These keep your cart, wishlist, recently viewed items and display preferences (such as dark mode) working. They are stored in your browser and are never used for tracking. They can't be switched off, because the shop doesn't work without them.",
        ],
      },
      {
        id: "analytics",
        heading: "Analytics (optional)",
        body: [
          "With your consent, we measure which pages and products people view and how they use the cart, so we can improve the store. These measurements are not used to identify you.",
        ],
      },
      {
        id: "marketing",
        heading: "Marketing (optional)",
        body: [
          "With your consent, advertising partners may use cookies to show you relevant offers on other sites and to measure how well our ads work.",
        ],
      },
      {
        id: "manage",
        heading: "Managing cookies",
        body: [
          "Use the button on this page to reopen the cookie banner and change your choice. You can also block or delete cookies in your browser settings; if you block necessary storage, the cart may stop working.",
        ],
      },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping & returns",
    description: "Delivery, the 100-night trial, returns and our 10-year warranty.",
    updated: "2026-10-27",
    intro: "Everything about getting your furniture home, and what happens if it isn't right.",
    sections: [
      {
        id: "delivery",
        heading: "Delivery",
        body: [
          "Delivery is free on orders over the free-delivery threshold and includes carrying your order to the room of your choice, unpacking it and taking the packaging away. Smaller orders ship for a flat fee.",
          "In-stock pieces ship within 2–4 working days. Made-to-order pieces take 4–6 weeks. We'll email you to book a delivery slot as soon as your order is ready.",
          "Express delivery is available for in-stock items at checkout.",
        ],
      },
      {
        id: "trial",
        heading: "100-night trial",
        body: [
          "Live with your piece for up to 100 nights. If it isn't right, tell us and we'll collect it for free and refund you in full.",
          "Made-to-order pieces can be returned within 30 days of delivery.",
        ],
      },
      {
        id: "returns",
        heading: "How to return",
        body: [
          "Email {email} with your order number. We'll book a collection at a time that suits you. Please keep the piece in the condition it arrived in; the original packaging isn't needed.",
          "Refunds are made to your original payment method within 5 working days of collection.",
        ],
      },
      {
        id: "warranty",
        heading: "10-year warranty",
        body: [
          "Frames, joints and drawer runners are covered for 10 years against manufacturing faults. Upholstery and finishes are covered for 2 years.",
          "The warranty doesn't cover normal wear, accidental damage, or marks that are part of natural materials. Replacement covers, cushions and legs are available for every design we've sold.",
        ],
      },
    ],
  },
];

export const getLegalPage = (slug: LegalPage["slug"]) => legalPages.find((p) => p.slug === slug)!;
