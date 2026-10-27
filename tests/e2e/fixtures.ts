import { test as base, expect } from "@playwright/test";

/**
 * Shared setup. By default the cookie choice is already made and the
 * newsletter pop-up already seen, so overlays don't cover what a test checks.
 * Tests about the banner or pop-up use `test.use({ freshVisitor: true })`.
 * `errors` collects page errors and console errors for assertions.
 */
export const test = base.extend<{ freshVisitor: boolean; errors: string[] }>({
  freshVisitor: [false, { option: true }],
  errors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) errors.push(m.text());
    });
    await provide(errors);
  },
  context: async ({ context, freshVisitor }, provide) => {
    if (!freshVisitor) {
      await context.addInitScript(() => {
        localStorage.setItem(
          "nordhaus:consent",
          JSON.stringify({ analytics: true, marketing: false, decidedAt: "test" }),
        );
        localStorage.setItem("nordhaus:newsletter-popup", JSON.stringify(new Date().toISOString()));
      });
    }
    await provide(context);
  },
});

export { expect };
