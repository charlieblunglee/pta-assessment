import type { NextConfig } from "next";

const securityHeaders = [
  // Next.js emits inline bootstrap data for React Server Component hydration.
  // A static header cannot attach per-request nonces, so allow only inline
  // scripts plus same-origin bundles until nonce-based middleware is added.
  { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.supabase.co https://api.brevo.com https://api.resend.com https://api.postmarkapp.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() { return [{ source: "/(.*)", headers: securityHeaders }]; }
};

export default nextConfig;
