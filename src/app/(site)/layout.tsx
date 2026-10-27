import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

/** Storefront chrome: announcement bar, header with mega menu, footer. */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
