/**
 * Logger utility for consistent error handling
 *
 * - In development: Logs to console
 * - In production: Suppresses logs (can be extended to send to logging service)
 */

const isDevelopment = process.env.NODE_ENV === "development";

interface LogContext {
  [key: string]: unknown;
}

/**
 * Log an error with optional context
 * @param message - Error message
 * @param error - Error object or additional context
 */
export function logError(message: string, error?: unknown, context?: LogContext): void {
  if (!isDevelopment) {
    // In production, you might want to send to a logging service like:
    // - Sentry
    // - LogRocket
    // - Datadog
    // For now, we suppress logs in production
    return;
  }

  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ERROR: ${message}`;

  if (error instanceof Error) {
    console.error(formattedMessage, {
      error: error.message,
      stack: error.stack,
      ...context,
    });
  } else if (error !== undefined) {
    console.error(formattedMessage, error, context);
  } else {
    console.error(formattedMessage, context);
  }
}

/**
 * Log a warning
 * @param message - Warning message
 * @param context - Additional context
 */
export function logWarn(message: string, context?: LogContext): void {
  if (!isDevelopment) return;

  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] WARN: ${message}`, context);
}

/**
 * Log info (development only)
 * @param message - Info message
 * @param context - Additional context
 */
export function logInfo(message: string, context?: LogContext): void {
  if (!isDevelopment) return;

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO: ${message}`, context);
}

/**
 * Log debug info (development only)
 * @param message - Debug message
 * @param context - Additional context
 */
export function logDebug(message: string, context?: LogContext): void {
  if (!isDevelopment) return;

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] DEBUG: ${message}`, context);
}
