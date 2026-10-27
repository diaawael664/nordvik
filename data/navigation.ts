/**
 * MENUS
 * Main navigation (with optional mega menu) and footer link columns.
 */
import type { ImageKey } from "./images";

export type NavLink = { label: string; href: string };

export type MegaMenu = {
  columns: { title: string; links: NavLink[] }[];
  feature?: { title: string; text: string; href: string; image: ImageKey };
};

export type NavItem = NavLink & { mega?: MegaMenu };

export const mainNav: NavItem[] = [
  {
    label: "Shop",
    href: "/shop/",
    mega: {
      columns: [
        {
          title: "Living",
          links: [
            { label: "Sofas", href: "/shop/sofas/" },
            { label: "Lounge chairs", href: "/shop/chairs/" },
            { label: "Storage", href: "/shop/storage/" },
            { label: "Rugs & textiles", href: "/shop/decor/" },
          ],
        },
        {
          title: "Dining & Work",
          links: [
            { label: "Dining chairs", href: "/shop/chairs/" },
            { label: "Tables & desks", href: "/shop/tables/" },
            { label: "Stools", href: "/shop/chairs/" },
          ],
        },
        {
          title: "Rest & Light",
          links: [
            { label: "Bedroom", href: "/shop/bedroom/" },
            { label: "Lighting", href: "/shop/lighting/" },
            { label: "Decor", href: "/shop/decor/" },
            { label: "All products", href: "/shop/" },
          ],
        },
      ],
      feature: {
        title: "The Autumn Edit",
        text: "Warm oak, rust velvet and low light for the darker months.",
        href: "/collections/",
        image: "room-amber",
      },
    },
  },
  { label: "Collections", href: "/collections/" },
  {
    label: "Pages",
    href: "/about/",
    mega: {
      columns: [
        {
          title: "Home layouts",
          links: [
            { label: "Home — Classic", href: "/" },
            { label: "Home — Editorial", href: "/home-editorial/" },
            { label: "Home — Modern", href: "/home-modern/" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About us", href: "/about/" },
            { label: "Journal", href: "/blog/" },
            { label: "Contact", href: "/contact/" },
            { label: "FAQ", href: "/faq/" },
          ],
        },
        {
          title: "Utility",
          links: [
            { label: "Account", href: "/account/" },
            { label: "Wishlist", href: "/wishlist/" },
            { label: "Coming soon", href: "/coming-soon/" },
            { label: "UI elements", href: "/elements/" },
            { label: "All demos", href: "/demos/" },
          ],
        },
      ],
    },
  },
  { label: "Journal", href: "/blog/" },
  { label: "About", href: "/about/" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Sofas", href: "/shop/sofas/" },
      { label: "Chairs", href: "/shop/chairs/" },
      { label: "Tables & desks", href: "/shop/tables/" },
      { label: "Lighting", href: "/shop/lighting/" },
      { label: "Decor", href: "/shop/decor/" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Delivery & returns", href: "/shipping-returns/" },
      { label: "Care guides", href: "/blog/" },
      { label: "Warranty", href: "/shipping-returns/#warranty" },
      { label: "Contact us", href: "/contact/" },
    ],
  },
  {
    title: "Nordvik",
    links: [
      { label: "Our story", href: "/about/" },
      { label: "Journal", href: "/blog/" },
      { label: "Lookbook", href: "/collections/" },
      { label: "Showrooms", href: "/contact/" },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy", href: "/privacy/" },
  { label: "Terms", href: "/terms/" },
  { label: "Cookies", href: "/cookies/" },
];
