import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const resultCount = async (page: Page) =>
  Number((await page.locator("p[aria-live=polite]").first().textContent())?.match(/\d+/)?.[0]);

test("shop lists, filters, sorts and paginates", async ({ page, errors }) => {
  await page.goto("/shop/");
  expect(await resultCount(page)).toBe(49);

  const filters = page.getByRole("complementary", { name: "Filters" });
  await filters.getByRole("button", { name: /^Sofas/ }).click();
  await expect(page).toHaveURL(/\/shop\/sofas\/$/);
  expect(await resultCount(page)).toBe(8);

  await filters.getByRole("button", { name: "Green", exact: true }).click();
  await expect(page).toHaveURL(/color=Green/);
  expect(await resultCount(page)).toBe(1);
  await page.getByRole("button", { name: "Remove filter: Green" }).click();

  await page.locator("#sort").selectOption("price-asc");
  await expect(page).toHaveURL(/sort=price-asc/);

  await page.goto("/shop/");
  const cards = page.locator("section[aria-labelledby=products-heading] article");
  const before = await cards.count();
  await page.getByRole("button", { name: "Load more" }).click();
  expect(await cards.count()).toBeGreaterThan(before);
  expect(errors).toEqual([]);
});

test("category pages have their own URL and title", async ({ page }) => {
  await page.goto("/shop/lighting/");
  await expect(page.locator("h1")).toHaveText("Lighting");
  await expect(page).toHaveTitle(/Lighting/);
});

test("filter layout: top panel replaces the sidebar", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nordhaus:demo-layout", JSON.stringify({ shopFilters: "top" })));
  await page.goto("/shop/");
  await expect(page.getByRole("complementary", { name: "Filters" })).toHaveCount(0);
  await page
    .getByRole("button", { name: /^Filters/ })
    .filter({ visible: true })
    .click();
  await expect(page.locator("#shop-top-filters")).toBeVisible();
});
