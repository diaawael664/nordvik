import { expect, test } from "./fixtures";

test("header: mega menu by keyboard, search and theme", async ({ page }) => {
  await page.goto("/");
  const shop = page.getByRole("button", { name: "Shop" });
  await shop.focus();
  await page.keyboard.press("Enter");
  await expect(shop).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(shop).toHaveAttribute("aria-expanded", "false");

  await page.getByRole("button", { name: "Search" }).filter({ visible: true }).first().click();
  await page.getByRole("searchbox", { name: "Search products" }).fill("oak");
  await expect(page.getByRole("dialog", { name: "Search" })).toContainText(/\d+ products/);
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("cart and wishlist persist across reloads", async ({ page }) => {
  await page.goto("/");
  const card = page.locator("article").filter({ hasText: "Lund Dining Chair" }).first();
  await card.scrollIntoViewIfNeeded();
  await card.getByRole("button", { name: "Save Lund Dining Chair to wishlist" }).click();
  await card.hover();
  await card.getByRole("button", { name: "Add Lund Dining Chair to cart" }).filter({ visible: true }).click();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByRole("button", { name: "Cart, 1 items" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Wishlist, 1 saved" })).toBeVisible();
});

test("style switcher previews a color preset", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Customize this demo" }).click();
  await page.getByRole("button", { name: /Clay & Linen/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-preset", "clay");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-preset", "clay");
});

test("analytics events reach the dataLayer after consent", async ({ page }) => {
  await page.goto("/product/lund-dining-chair/");
  await page.getByRole("button", { name: /Add to cart — / }).click();
  const events = await page.evaluate(() =>
    (window.dataLayer ?? []).flatMap((e) => {
      const name = (e as { event?: string }).event;
      return name ? [name] : [];
    }),
  );
  expect(events).toEqual(expect.arrayContaining(["view_item", "add_to_cart"]));
});

test("the cookie policy page reopens the cookie banner", async ({ page }) => {
  await page.goto("/cookies/");
  await expect(page.getByText("Analytics: on. Marketing: off.")).toBeVisible();
  await page.getByRole("button", { name: "Change cookie settings" }).click();
  await expect(page.getByRole("region", { name: "Cookie preferences" })).toBeVisible();
});

test("footer policy links lead to real pages", async ({ page }) => {
  await page.goto("/");
  for (const [label, heading] of [
    ["Privacy", "Privacy policy"],
    ["Terms", "Terms of sale"],
    ["Delivery & returns", "Shipping & returns"],
  ]) {
    await page.getByRole("contentinfo").getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator("h1")).toHaveText(heading);
    await page.goBack();
  }
});

test.describe("first visit", () => {
  test.use({ freshVisitor: true });

  test("the cookie banner holds analytics until accepted", async ({ page }) => {
    await page.goto("/product/lund-dining-chair/");
    const banner = page.getByRole("region", { name: "Cookie preferences" });
    await expect(banner).toBeVisible();
    expect(await page.evaluate(() => (window.dataLayer ?? []).length)).toBe(0);
    await banner.getByRole("button", { name: "Accept all" }).click();
    await expect(banner).toHaveCount(0);
  });

  test("the newsletter pop-up appears after its delay and reveals a code", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await page.getByRole("button", { name: "Reject optional" }).click();
    await page.clock.fastForward(30_000);
    const dialog = page.getByRole("dialog", { name: "Newsletter sign-up" });
    await expect(dialog).toBeVisible();
    await dialog.locator("input[name=email]").fill("astrid@example.com");
    await dialog.getByRole("button", { name: "Get my code" }).click();
    await expect(dialog).toContainText("WELCOME10");
  });
});
