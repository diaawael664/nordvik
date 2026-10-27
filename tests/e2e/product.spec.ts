import { expect, test } from "./fixtures";

test("options change the price and add to cart", async ({ page, errors }) => {
  await page.goto("/product/atlas-wool-rug/");
  await page.getByText("200 × 300 cm").click();
  const add = page.getByRole("button", { name: /Add to cart — / });
  await expect(add).toContainText("$1,080");
  await add.click();
  await expect(page.getByRole("dialog", { name: /Your cart/ })).toContainText("Atlas Wool Rug");
  expect(errors).toEqual([]);
});

test("tabs, units and delivery estimate", async ({ page }) => {
  await page.goto("/product/fjell-three-seat-sofa/");
  await page.getByRole("tab", { name: "Description" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Dimensions" })).toHaveAttribute("aria-selected", "true");
  await page.getByRole("button", { name: "in", exact: true }).click();
  await expect(page.getByRole("cell", { name: "84.3 in" })).toBeVisible();

  await page.getByLabel("Delivery date for ZIP").fill("11211");
  await page.getByRole("button", { name: "Check" }).click();
  await expect(page.getByText(/Arrives .* to 11211/)).toBeVisible();
});

test("a sold-out product offers a back-in-stock alert", async ({ page }) => {
  await page.goto("/product/brisk-armchair/");
  await expect(page.getByRole("button", { name: /Add to cart —/ })).toHaveCount(0);
  await page.locator("input[name=email]").fill("astrid@example.com");
  await page.getByRole("button", { name: "Notify me" }).click();
  await expect(page.getByText("We'll email astrid@example.com")).toBeVisible();
});

test("fabric swatches can be requested", async ({ page }) => {
  await page.goto("/product/fjell-three-seat-sofa/");
  await page.getByRole("button", { name: /free fabric swatches/ }).click();
  const dialog = page.getByRole("dialog", { name: "Order free fabric swatches" });
  await dialog.getByRole("button", { name: "Pine velvet" }).click();
  await dialog.locator("input[name=name]").fill("Astrid");
  await dialog.locator("input[name=email]").fill("astrid@example.com");
  await dialog.locator("input[name=address]").fill("45 Harbor Lane, Brooklyn");
  await dialog.getByRole("button", { name: "Send my swatches" }).click();
  await expect(dialog.getByText("Your swatches are on their way")).toBeVisible();
});

test("a complete-the-look set gets its discount in the cart", async ({ page }) => {
  await page.goto("/product/vinge-lounge-chair/");
  await page.getByRole("button", { name: "Add the set to cart" }).click();
  await page.goto("/cart/");
  await expect(page.getByRole("complementary", { name: "Order summary" })).toContainText(
    "Set saving: The reading corner",
  );
});

test("gallery layout: stacked shows every image", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("nordvik:demo-layout", JSON.stringify({ productGallery: "stacked" })),
  );
  await page.goto("/product/fjell-three-seat-sofa/");
  await expect(page.getByRole("button", { name: /full screen/ }).filter({ visible: true })).toHaveCount(3);
});

test("recently viewed remembers products", async ({ page }) => {
  await page.goto("/product/halo-pendant/");
  // The visit is recorded once the page is interactive.
  await expect.poll(() => page.evaluate(() => localStorage.getItem("nordvik:recent") ?? "")).toContain("p15");
  await page.goto("/product/ask-stool/");
  await expect(page.getByRole("region", { name: "Recently viewed" })).toContainText("Halo Pendant");
});
