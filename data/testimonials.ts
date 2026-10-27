/**
 * CUSTOMER TESTIMONIALS
 * `product` is a product slug from data/products.ts (links the quote to it).
 */
export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  product: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We measured the doorway twice and it still came through with room to spare. Two years on, the cushions haven't lost their shape and the velvet looks better than the day it arrived.",
    name: "Astrid L.",
    location: "Brooklyn, NY",
    product: "fjell-three-seat-sofa",
    rating: 5,
  },
  {
    quote:
      "The delivery team carried it up four flights, unwrapped it, and took every scrap of packaging away. The leather has already started to darken where we sit most. Exactly what we hoped for.",
    name: "Daniel & Mira K.",
    location: "Chicago, IL",
    product: "saga-leather-sofa",
    rating: 5,
  },
  {
    quote:
      "I bought one Lund chair to test it and came back for seven more. They're light enough for my kids to move and they wipe clean after every dinner.",
    name: "Priya S.",
    location: "Austin, TX",
    product: "lund-dining-chair",
    rating: 5,
  },
  {
    quote:
      "Vinge is the first chair I've owned that I'd call beautiful from the back. It sits by the window and it's where I read every morning.",
    name: "Tom H.",
    location: "Portland, OR",
    product: "vinge-lounge-chair",
    rating: 5,
  },
];
