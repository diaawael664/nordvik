import { heroSlides } from "@data/home";
import { bestSellers, newArrivals } from "@/lib/catalog";
import { FeaturesBar } from "@/components/sections/features-bar";
import { HeroSlider } from "@/components/sections/hero-slider";
import {
  CategoryTiles,
  DealSection,
  PressStrip,
  ProductGrid,
  ProductRail,
  PromoPair,
  SocialGallery,
  StorySplit,
  Testimonials,
} from "@/components/sections/home-sections";
import { Newsletter } from "@/components/sections/newsletter";

/**
 * Home 1 — Classic minimal.
 * Sections are independent components; reorder or remove lines to change the layout.
 */
export default function HomeClassic() {
  return (
    <>
      <HeroSlider slides={heroSlides} />
      <FeaturesBar />
      <CategoryTiles slugs={["sofas", "chairs", "tables", "lighting"]} />
      <ProductRail eyebrow="Most loved" title="Best sellers" items={bestSellers()} className="pt-0 md:pt-0" />
      <PromoPair />
      <StorySplit />
      <ProductGrid
        eyebrow="Just in"
        title="New arrivals"
        items={newArrivals()}
        href="/shop/?sort=newest"
        linkLabel="Shop all new arrivals"
      />
      <DealSection />
      <Testimonials />
      <PressStrip />
      <SocialGallery />
      <Newsletter />
    </>
  );
}
