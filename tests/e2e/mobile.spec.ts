import { expect, test } from "./fixtures";

test("mobile: menu, filter drawer and sticky add-to-cart", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/shop/");
  await page
    .getByRole("button", { name: /^Filters/ })
    .first()
    .click();
  await expect(page.getByRole("dialog", { name: "Filters" })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/product/fjell-three-seat-sofa/");
  const bar = page.locator("div.fixed.bottom-0").filter({ hasText: "Add to cart" });
  await expect(bar).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 1800));
  await expect(bar).toHaveCount(1);
});

test("mobile: no sideways scrolling on key pages", async ({ page }) => {
  for (const path of [
    "/",
    "/home-editorial/",
    "/home-modern/",
    "/shop/",
    "/product/dune-modular-sofa/",
    "/checkout/",
    "/blog/measuring-for-a-new-sofa/",
    "/account/orders/",
  ]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
