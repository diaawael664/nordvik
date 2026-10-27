/**
 * ABOUT PAGE CONTENT
 * Story, values, numbers and team.
 */
import type { ImageKey } from "./images";

export const about = {
  hero: {
    eyebrow: "Our story",
    title: "We make furniture for the next forty years, not the next season.",
    image: "studio-exterior" as ImageKey,
  },
  story: [
    "Nordvik started in 1987 as a two-person joinery on the edge of Copenhagen, repairing chairs that other people had given up on. Fixing them taught us what makes furniture last: solid wood, honest joints, and covers you can take off and wash.",
    "Today we're a team of forty-two, and we still build the way we learned then. Frames are kiln-dried hardwood, joined with dowels and glue. Fabrics are woven to last tens of thousands of rubs. Every piece is designed so that, decades from now, it can be repaired instead of replaced.",
  ],
  quote: {
    text: "A chair should get better with every year someone sits in it.",
    author: "Ingrid Holm, Head of Design",
  },
  values: [
    {
      title: "Made to be repaired",
      text: "Every part we use can be replaced. We keep spare covers, cushions and legs for every design we've ever sold.",
    },
    {
      title: "Traceable wood",
      text: "Our oak, ash and walnut are FSC-certified and come from forests we can name, most of them within 800 km of the workshop.",
    },
    {
      title: "Fewer, better pieces",
      text: "We release a handful of designs a year and keep making the good ones. Some of our chairs have been in the range for thirty years.",
    },
    {
      title: "Fair to the people who make it",
      text: "Our upholsterers and joiners are employed, not contracted, and every frame is signed by the person who built it.",
    },
  ],
  stats: [
    { value: "1987", label: "Year the workshop opened" },
    { value: "42", label: "Makers, designers and drivers" },
    { value: "38,000", label: "Homes furnished" },
    { value: "10 yr", label: "Warranty on every frame" },
  ],
  team: [
    { name: "Ingrid Holm", role: "Head of Design", image: "team-1" as ImageKey },
    { name: "Mads Kjær", role: "Master Joiner", image: "team-2" as ImageKey },
    { name: "Rafael Santos", role: "Upholstery Lead", image: "team-3" as ImageKey },
    { name: "Lea Andersen", role: "Customer Care", image: "team-4" as ImageKey },
  ],
  process: [
    {
      step: "Drawn",
      text: "Every design starts as a full-size drawing on the workshop wall, then a rough prototype in pine.",
    },
    {
      step: "Tested",
      text: "Prototypes live in our homes for months. Most don't survive; the ones that do get refined.",
    },
    { step: "Built", text: "Frames are cut, joined and finished by hand in batches of twenty to fifty." },
    {
      step: "Delivered",
      text: "Our own team carries each piece into your home, places it and takes the packaging away.",
    },
  ],
};
