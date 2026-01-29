/**
 * Test data for E2E tests
 * All data should be valid according to Zod schemas
 */

/**
 * Contact form test data (matches contactSchema in contact/route.ts)
 */
export const CONTACT_FORM_DATA = {
  valid: {
    name: "Test Kullanici",
    email: "test@example.com",
    phone: "0532 123 4567",
    company: "Test Sirket Ltd.",
    subject: "E2E Test Mesaji",
    message: "Bu bir E2E test mesajidir. Lutfen dikkate almayin. Test otomasyonu tarafindan olusturulmustur.",
  },
  minimal: {
    name: "Min Test",
    email: "minimal@test.com",
    message: "Bu minimal bir test mesajidir - en az 10 karakter.",
  },
  invalid: {
    shortName: {
      name: "A", // too short (min 2)
      email: "test@test.com",
      message: "Valid message content here.",
    },
    invalidEmail: {
      name: "Test User",
      email: "not-an-email",
      message: "Valid message content here.",
    },
    shortMessage: {
      name: "Test User",
      email: "test@test.com",
      message: "Short", // too short (min 10)
    },
  },
};

/**
 * Admin page test data
 */
export const PAGE_TEST_DATA = {
  slug: `test-page-e2e-${Date.now()}`,
  title: "[E2E TEST] Test Sayfasi",
  titleEn: "[E2E TEST] Test Page",
  content: {
    blocks: [
      {
        type: "paragraph",
        content: "Bu bir E2E test sayfasidir.",
      },
    ],
  },
};

/**
 * Hero slide test data
 */
export const HERO_SLIDE_TEST_DATA = {
  titlePrefix: "[E2E TEST]",
  modifiedTitle: "[E2E TEST] Guncellenmis Baslik",
};

/**
 * Generate unique identifier for test isolation
 */
export function generateTestId(): string {
  return `e2e-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Wait utilities (use sparingly, prefer locator-based waits)
 */
export const WAIT_TIMES = {
  short: 500,
  medium: 1000,
  long: 2000,
  veryLong: 5000,
};
