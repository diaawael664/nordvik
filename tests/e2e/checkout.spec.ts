import { expect, test } from "./fixtures";

test("promo code, validation, placing an order and tracking it", async ({ page, errors }) => {
  await page.goto("/product/kvist-bar-stool/");
  await page.getByRole("button", { name: /Add to cart — / }).click();
  await page.goto("/cart/");

  const summary = page.getByRole("complementary", { name: "Order summary" });
  await page.locator("#promo").fill("nope");
  await summary.getByRole("button", { name: "Apply" }).click();
  await expect(summary).toContainText("isn't a valid code");
  await page.locator("#promo").fill("welcome10");
  await summary.getByRole("button", { name: "Apply" }).click();
  await expect(summary).toContainText("Discount (WELCOME10)");

  await summary.getByRole("button", { name: "Checkout" }).click();
  await expect(page).toHaveURL(/\/checkout\/$/);
  const fill = (name: string, value: string) => page.locator(`input[name=${name}]`).fill(value);

  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "need attention" })).toBeVisible();

  await fill("email", "astrid@example.com");
  await fill("firstName", "Astrid");
  await fill("lastName", "Lindqvist");
  await fill("address", "45 Harbor Lane");
  await fill("city", "Brooklyn");
  await fill("postcode", "11249");
  await fill("phone", "2125550148");
  await fill("cardName", "Astrid Lindqvist");
  await fill("cardNumber", "4242424242424241");
  await fill("cardExpiry", "1230");
  await fill("cardCvc", "123");
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByText("This card number isn't valid")).toBeVisible();

  await fill("cardNumber", "4242424242424242");
  await page.getByRole("button", { name: /Place order/ }).click();
  await expect(page.getByText("Thank you, your order is placed")).toBeVisible();

  await page.getByRole("link", { name: "Track your order" }).click();
  await expect(page.getByRole("heading", { name: /Order NV-/ })).toBeVisible();
  await expect(page.getByText("Kvist Bar Stool")).toBeVisible();
  expect(errors).toEqual([]);
});
