import { Page, expect } from "@playwright/test";

/**
 * Test credentials from environment or defaults
 */
export const TEST_CREDENTIALS = {
  email: process.env.TEST_ADMIN_EMAIL || "admin@ngeltd.net",
  password: process.env.TEST_ADMIN_PASSWORD || "test-password",
};

/**
 * Login as admin user
 * @param page - Playwright page instance
 * @param credentials - Optional custom credentials
 * @returns true if login succeeded, false otherwise
 */
export async function loginAsAdmin(
  page: Page,
  credentials?: { email: string; password: string }
): Promise<boolean> {
  const { email, password } = credentials || TEST_CREDENTIALS;

  // Navigate to login page
  await page.goto("/admin/login");

  // Wait for login form to be visible
  await page.waitForSelector('input[type="email"]', { state: "visible" });

  // Fill login form
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for either redirect to admin dashboard OR error message
  try {
    await page.waitForURL(/\/admin(?!\/login)/, { timeout: 10000 });
    return true;
  } catch {
    // Login failed - check if still on login page
    const currentUrl = page.url();
    if (currentUrl.includes("/admin/login")) {
      console.warn("Login failed - check TEST_ADMIN_PASSWORD in .env.test");
      return false;
    }
    return false;
  }
}

/**
 * Logout from admin panel
 * @param page - Playwright page instance
 */
export async function logoutAdmin(page: Page): Promise<void> {
  // Look for logout button/link in header
  const logoutButton = page.locator('button:has-text("Çıkış"), a:has-text("Çıkış")');

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  } else {
    // Fallback: Navigate directly to logout
    await page.goto("/api/auth/logout", { waitUntil: "networkidle" });
  }

  // Verify redirect to login page
  await page.waitForURL(/\/admin\/login/);
}

/**
 * Check if user is logged in
 * @param page - Playwright page instance
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Try to access admin dashboard
  await page.goto("/admin");

  // Check if redirected to login
  const currentUrl = page.url();
  return !currentUrl.includes("/admin/login");
}

/**
 * Clear all cookies and storage to ensure clean state
 * @param page - Playwright page instance
 */
export async function clearAuthState(page: Page): Promise<void> {
  const context = page.context();
  await context.clearCookies();
}
