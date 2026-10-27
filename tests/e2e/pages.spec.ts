import { expect, test } from "./fixtures";

/** Every page type loads with no errors, failed requests or sideways scrolling. */
const paths = [
  "/",
  "/home-editorial/",
  "/home-modern/",
  "/shop/",
  "/shop/sofas/?color=Green",
  "/product/fjell-three-seat-sofa/",
  "/cart/",
  "/checkout/",
  "/wishlist/",
  "/collections/",
  "/about/",
  "/blog/",
  "/blog/caring-for-oiled-oak/",
  "/blog/category/care/",
  "/contact/",
  "/faq/",
  "/account/",
  "/account/orders/",
  "/account/addresses/",
  "/coming-soon/",
  "/elements/",
  "/privacy/",
  "/terms/",
  "/cookies/",
  "/shipping-returns/",
];

for (const colorScheme of ["light", "dark"] as const) {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`all pages load cleanly (${colorScheme}, motion: ${reducedMotion})`, async ({ page, errors }) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme, reducedMotion });
      const failed: string[] = [];
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      for (const path of paths) {
        await page.goto(path, { waitUntil: "networkidle" });
        await expect(page.locator("h1").first()).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `horizontal overflow on ${path}`).toBeLessThanOrEqual(0);
      }
      expect(failed).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("unknown URLs show the 404 page", async ({ page }) => {
  const res = await page.goto("/not-a-real-page/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("This page has moved out.");
});
