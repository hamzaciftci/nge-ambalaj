"use client";

import { useEffect } from "react";
import { logError } from "@/lib/logger";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Boundary - catches errors in root layout
 * This component must include html and body tags since it replaces the entire page
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error
    logError("CRITICAL: Global error boundary triggered", error, {
      digest: error.digest,
      name: error.name,
      message: error.message,
      // In production, you would send this to a monitoring service like Sentry
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="tr">
      <head>
        <title>Kritik Hata | NGE Ambalaj</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            padding: "24px",
          }}
        >
          {/* Error Icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 24px",
              backgroundColor: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          {/* Error Title */}
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "12px",
              color: "#0f172a",
            }}
          >
            Kritik Bir Hata Oluştu
          </h1>

          {/* Error Description */}
          <p
            style={{
              fontSize: "16px",
              color: "#64748b",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            Uygulama beklenmedik bir hatayla karşılaştı. Lütfen sayfayı
            yenileyin veya daha sonra tekrar deneyin.
          </p>

          {/* Development-only error details */}
          {isDevelopment && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#dc2626",
                  marginBottom: "8px",
                }}
              >
                Development Error Details:
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontFamily: "monospace",
                  color: "#991b1b",
                  wordBreak: "break-word",
                }}
              >
                {error.name}: {error.message}
              </p>
              {error.digest && (
                <p
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    color: "#b91c1c",
                    marginTop: "8px",
                  }}
                >
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                width: "100%",
                maxWidth: "200px",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 2v6h-6" />
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M3 22v-6h6" />
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Tekrar Dene
            </button>

            <a
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                cursor: "pointer",
                textDecoration: "none",
                transition: "background-color 0.2s",
                width: "100%",
                maxWidth: "200px",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#ffffff")
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Ana Sayfa
            </a>
          </div>

          {/* Footer */}
          <p
            style={{
              marginTop: "32px",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            NGE Ambalaj &copy; {new Date().getFullYear()}
          </p>
        </div>
      </body>
    </html>
  );
}
