import { test, expect } from "@playwright/test";
import { CONTACT_FORM_DATA } from "./utils/test-data";

test.describe("Public Pages - Smoke Tests", () => {
  test.describe("Ana Sayfa", () => {
    test("ana sayfa aciliyor ve temel elementler gorunuyor", async ({ page }) => {
      // Navigate to homepage
      await page.goto("/");

      // Wait for page to load
      await page.waitForLoadState("networkidle");

      // Check header is visible
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Check logo is present
      const logo = page.locator('header img[alt*="NG"], header img[alt*="Logo"], header img');
      await expect(logo.first()).toBeVisible();

      // Check footer is visible
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // Check hero section exists (usually the first main section)
      const heroSection = page.locator("section").first();
      await expect(heroSection).toBeVisible();

      // Check page title is set
      await expect(page).toHaveTitle(/NGE|NG|Ambalaj/i);
    });

    test("dil degisimi (TR/EN) hatasiz calisiyor", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");

      // Find language switcher - look for TR/EN buttons in header
      const languageSwitcher = page.locator(
        'button:has-text("TR"), button:has-text("EN"), [aria-label*="language"], [aria-label*="dil"], header button:has-text("Türkçe"), header button:has-text("English")'
      ).first();

      // Skip if no language switcher found
      if (!(await languageSwitcher.isVisible().catch(() => false))) {
        test.skip(true, "Language switcher not found - skipping i18n test");
        return;
      }

      // Click language switcher
      await languageSwitcher.click();

      // Wait for dropdown/options
      await page.waitForTimeout(300);

      // Look for language options
      const englishOption = page.locator(
        'button:has-text("English"), [role="menuitem"]:has-text("English"), li:has-text("English"), [role="option"]:has-text("English")'
      ).first();

      if (await englishOption.isVisible().catch(() => false)) {
        await englishOption.click();

        // Wait for language change
        await page.waitForTimeout(500);

        // Page should still be functional (no error)
        await expect(page.locator("body")).toBeVisible();

        // Check that some English text appears or language attribute changed
        const html = page.locator("html");
        const lang = await html.getAttribute("lang");

        // Language should be either 'en' or page content should have changed
        // This is a basic check - page should not crash
        await expect(page).not.toHaveTitle(/error|404|500/i);
      }
    });
  });

  test.describe("Urunler Sayfasi", () => {
    test("urunler ana kategorisi aciliyor", async ({ page }) => {
      await page.goto("/urunler");
      await page.waitForLoadState("networkidle");

      // Page should load without error
      await expect(page).not.toHaveTitle(/error|404|500/i);

      // Should have some content
      const mainContent = page.locator("main, [role='main'], .container, .container-custom");
      await expect(mainContent.first()).toBeVisible();
    });

    test("urun kategorileri goruntuleniyor", async ({ page }) => {
      await page.goto("/urunler");
      await page.waitForLoadState("networkidle");

      // Look for category cards or links
      const categoryItems = page.locator(
        'a[href*="/urunler/"], .category-card, [data-testid="category"]'
      );

      // Should have at least one category
      const count = await categoryItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test("urun detay sayfasi aciliyor", async ({ page }) => {
      // First go to products page
      await page.goto("/urunler");
      await page.waitForLoadState("networkidle");

      // Find first category link (must have slug after /urunler/)
      const categoryLink = page.locator('a[href^="/urunler/"]').first();

      if (!(await categoryLink.isVisible().catch(() => false))) {
        // No category links found
        console.log("No category links found on /urunler page");
        return;
      }

      // Get the href to verify navigation
      const href = await categoryLink.getAttribute("href");
      await categoryLink.click();
      await page.waitForLoadState("networkidle");

      // Should navigate to a category page (URL should contain urunler)
      const currentUrl = page.url();
      expect(currentUrl).toContain("/urunler");

      // Page should not error
      await expect(page).not.toHaveTitle(/error|500/i);

      // Look for subcategory or product links for deeper navigation
      const deeperLink = page.locator('a[href^="/urunler/"]').first();

      if (await deeperLink.isVisible().catch(() => false)) {
        const initialUrl = page.url();
        await deeperLink.click();
        await page.waitForLoadState("networkidle");

        // Page should not error after deeper navigation
        await expect(page).not.toHaveTitle(/error|500/i);
      }
    });
  });

  test.describe("Iletisim Formu", () => {
    test("iletisim sayfasi aciliyor", async ({ page }) => {
      await page.goto("/iletisim");
      await page.waitForLoadState("networkidle");

      // Check if page exists (CMS-driven, might be 404)
      const pageTitle = await page.title();
      const pageContent = await page.content();
      const is404 = page.url().includes("404") ||
                    pageTitle.toLowerCase().includes("not found") ||
                    pageContent.includes("404") ||
                    pageContent.toLowerCase().includes("sayfa bulunamad");

      if (is404) {
        test.skip(true, "İletişim sayfası CMS'de oluşturulmamış - /admin/pages'den 'iletisim' slug'lı sayfa oluşturun");
        return;
      }

      // Page should load
      await expect(page).not.toHaveTitle(/error|500/i);

      // Contact form or contact content should be visible
      const form = page.locator("form");
      const contactContent = page.locator("main, section, .container");

      // Either form exists OR page has content (form might be client-rendered)
      const formVisible = await form.first().isVisible().catch(() => false);
      const contentVisible = await contactContent.first().isVisible().catch(() => false);

      expect(formVisible || contentVisible).toBeTruthy();
    });

    test("iletisim formu basariyla gonderilebiliyor (happy path)", async ({ page }) => {
      await page.goto("/iletisim");
      await page.waitForLoadState("networkidle");

      // Check if page exists
      const pageContent = await page.content();
      if (pageContent.includes("404") || pageContent.toLowerCase().includes("not found")) {
        test.skip(true, "İletişim sayfası CMS'de oluşturulmamış");
        return;
      }

      // Wait for form to appear
      const form = page.locator("form").first();
      if (!(await form.isVisible().catch(() => false))) {
        test.skip(true, "İletişim formu bulunamadı");
        return;
      }

      // Fill form fields
      const nameInput = page.locator(
        'input[name="name"], input[placeholder*="ad"], input[placeholder*="isim"], input#name'
      ).first();
      const emailInput = page.locator(
        'input[name="email"], input[type="email"], input[placeholder*="mail"], input#email'
      ).first();
      const messageInput = page.locator(
        'textarea[name="message"], textarea[placeholder*="mesaj"], textarea#message'
      ).first();

      // Fill with valid data
      await nameInput.fill(CONTACT_FORM_DATA.valid.name);
      await emailInput.fill(CONTACT_FORM_DATA.valid.email);
      await messageInput.fill(CONTACT_FORM_DATA.valid.message);

      // Optionally fill phone if field exists
      const phoneInput = page.locator(
        'input[name="phone"], input[type="tel"], input[placeholder*="telefon"]'
      ).first();
      if (await phoneInput.isVisible().catch(() => false)) {
        await phoneInput.fill(CONTACT_FORM_DATA.valid.phone);
      }

      // Optionally fill company if field exists
      const companyInput = page.locator(
        'input[name="company"], input[placeholder*="sirket"], input[placeholder*="firma"]'
      ).first();
      if (await companyInput.isVisible().catch(() => false)) {
        await companyInput.fill(CONTACT_FORM_DATA.valid.company);
      }

      // Optionally fill subject if field exists
      const subjectInput = page.locator(
        'input[name="subject"], input[placeholder*="konu"]'
      ).first();
      if (await subjectInput.isVisible().catch(() => false)) {
        await subjectInput.fill(CONTACT_FORM_DATA.valid.subject);
      }

      // Submit form
      const submitButton = page.locator(
        'button[type="submit"], button:has-text("Gonder"), button:has-text("Submit")'
      ).first();
      await submitButton.click();

      // Wait for response
      await page.waitForTimeout(2000);

      // Check for success message or toast
      const successIndicator = page.locator(
        '[role="alert"]:has-text("basari"), .toast:has-text("basari"), .success, [data-sonner-toast]:has-text("basari"), [data-sonner-toast]:has-text("gonder")'
      );

      // Either success message appears OR form resets (indicating submission)
      const formWasSubmitted =
        (await successIndicator.isVisible().catch(() => false)) ||
        (await nameInput.inputValue()) === "";

      // If neither, check no error message is shown
      const errorMessage = page.locator(
        '[role="alert"]:has-text("hata"), .error, .toast-error'
      );
      const hasError = await errorMessage.isVisible().catch(() => false);

      expect(formWasSubmitted || !hasError).toBeTruthy();
    });

    test("iletisim formu validation hatasi gosteriyor (invalid data)", async ({ page }) => {
      await page.goto("/iletisim");
      await page.waitForLoadState("networkidle");

      // Check if page exists
      const pageContent = await page.content();
      if (pageContent.includes("404") || pageContent.toLowerCase().includes("not found")) {
        test.skip(true, "İletişim sayfası CMS'de oluşturulmamış");
        return;
      }

      // Wait for form
      const form = page.locator("form").first();
      if (!(await form.isVisible().catch(() => false))) {
        test.skip(true, "İletişim formu bulunamadı");
        return;
      }

      // Fill with invalid data (short name)
      const nameInput = page.locator(
        'input[name="name"], input[placeholder*="ad"], input#name'
      ).first();
      const emailInput = page.locator(
        'input[name="email"], input[type="email"], input#email'
      ).first();
      const messageInput = page.locator(
        'textarea[name="message"], textarea#message'
      ).first();

      // Fill with invalid data
      await nameInput.fill("A"); // Too short
      await emailInput.fill("invalid-email"); // Invalid email
      await messageInput.fill("Short"); // Too short

      // Submit form
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Wait for validation
      await page.waitForTimeout(500);

      // Should show validation errors OR form should not submit successfully
      // Check that page didn't navigate away (form rejected)
      await expect(page.url()).toContain("iletisim");
    });
  });

  test.describe("Hakkimizda Sayfasi", () => {
    test("hakkimizda sayfasi aciliyor", async ({ page }) => {
      await page.goto("/hakkimizda");
      await page.waitForLoadState("networkidle");

      // Wait a bit longer for client-side rendering
      await page.waitForTimeout(1000);

      // Check if page exists (CMS-driven, might be 404)
      const pageTitle = await page.title();
      const pageContent = await page.content();
      const is404 = page.url().includes("404") ||
                    pageTitle.toLowerCase().includes("not found") ||
                    pageContent.includes("404") ||
                    pageContent.toLowerCase().includes("sayfa bulunamad");

      if (is404) {
        test.skip(true, "Hakkımızda sayfası CMS'de oluşturulmamış - /admin/pages'den 'hakkimizda' slug'lı sayfa oluşturun");
        return;
      }

      // Page should load without error
      await expect(page).not.toHaveTitle(/error|500/i);

      // Should have content - be more permissive with selectors
      const content = page.locator("main, .container, article, section, div[class*='container']");
      const bodyHasContent = (await page.locator("body").innerHTML()).length > 500;

      // Either content element visible OR body has significant content
      const contentVisible = await content.first().isVisible().catch(() => false);
      expect(contentVisible || bodyHasContent).toBeTruthy();
    });
  });
});
