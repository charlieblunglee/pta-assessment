/**
 * POST /api/email-results
 * Sends the executive assessment summary by email.
 *
 * SECURITY / PRIVACY
 * - Runs only on the server. The RESEND_API_KEY is read from an encrypted
 *   environment variable and is never exposed to the browser.
 * - Emails ONLY the approved executive fields. Uploaded artifacts, evidence
 *   notes, raw answers, and any PHI are never accepted or sent here.
 *
 * DEPLOY (Vercel or any Node serverless platform)
 * 1. Create a Resend account and verify an organizational sending domain.
 * 2. Set environment variables in your host (encrypted):
 *      RESEND_API_KEY     = re_xxxxxxxxxxxxxxxxxxxx
 *      RESULTS_FROM_EMAIL = Assessment <assessment@yourcompany.com>
 * 3. Redeploy. Without these variables the app shows a safe delivery-error
 *    state and keeps the completed assessment on screen.
 *
 * NOTE: the in-memory limiter below protects a single instance only. For a
 * public production launch, replace it with your platform's distributed
 * rate-limiter (e.g. Upstash, Vercel KV) as noted in SETUP-GUIDE.md.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 5;    // per client per window
const hits = new Map();      // ip -> [timestamps]

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v = "") =>
  String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Whitelist: only these fields ever leave the server.
function buildEmailHtml(p) {
  const priorities = Array.isArray(p.immediatePriorities) ? p.immediatePriorities.slice(0, 5) : [];
  const row = (label, value) =>
    `<tr><td style="padding:8px 0;color:#5f7280;font-size:13px;width:190px;vertical-align:top">${esc(label)}</td>
         <td style="padding:8px 0;color:#0c1c27;font-size:15px;font-weight:600">${esc(value)}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#eef2f5;font-family:Inter,Arial,sans-serif">
    <div style="max-width:600px;margin:0 auto;padding:24px">
      <div style="background:#003b5c;color:#fff;border-radius:14px 14px 0 0;padding:20px 24px">
        <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fd6d1">Concentrix</div>
        <div style="font-size:20px;font-weight:800;margin-top:4px">Program Technology Profile Assessment</div>
      </div>
      <div style="background:#fff;border:1px solid #e4ebef;border-top:0;border-radius:0 0 14px 14px;padding:24px">
        <h2 style="margin:0 0 4px;color:#003b5c">${esc(p.company)}</h2>
        <p style="margin:0 0 16px;color:#5f7280">${esc(p.lineOfBusiness)} &middot; ${esc(p.healthcareTrack)} &middot; ${esc(p.assessmentDate)}</p>
        <div style="background:#f6f9fb;border:1px solid #e4ebef;border-radius:12px;padding:16px 20px;margin-bottom:16px">
          <span style="font-size:12px;color:#5f7280;text-transform:uppercase;letter-spacing:.08em">Program Technology Score</span>
          <div style="font-size:40px;font-weight:800;color:#003b5c;line-height:1">${esc(p.programScore)}<span style="font-size:16px;color:#5f7280">/100</span></div>
          <div style="color:#0c1c27;font-weight:600">${esc(p.maturity)}</div>
        </div>
        <table style="width:100%;border-collapse:collapse">
          ${row("Recommended package", p.recommendedPackage)}
          ${row("Primary focus", p.primaryFocus)}
          ${row("Assessment confidence", p.confidence)}
          ${row("Disposition", p.disposition)}
          ${row("Recommended further analysis", p.recommendedFurtherAnalysis)}
        </table>
        ${priorities.length ? `<h3 style="color:#003b5c;margin:20px 0 8px">Immediate priorities</h3>
          <ol style="margin:0;padding-left:20px;color:#31424d">${priorities.map((x) => `<li style="margin:4px 0">${esc(x)}</li>`).join("")}</ol>` : ""}
        <p style="margin-top:24px;font-size:12px;color:#5f7280">This summary contains assessment findings only. Uploaded evidence, evidence notes, and any personal health information are excluded.</p>
      </div>
    </div></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
  }

  // Body may arrive parsed (Vercel) or as a raw string.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Missing body" });
  if (!isEmail(body.email)) return res.status(400).json({ error: "A valid email address is required." });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESULTS_FROM_EMAIL;
  if (!apiKey || !from) {
    // Not configured yet — tell the client cleanly so it shows the safe error state.
    return res.status(503).json({ error: "Email delivery is not configured on this server." });
  }

  const html = buildEmailHtml(body);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [body.email],
        subject: `Your Program Technology Profile Assessment — ${body.company || "Results"}`,
        html,
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("Resend error", r.status, detail);
      return res.status(502).json({ error: "The email service rejected the request." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("email-results failure", err);
    return res.status(500).json({ error: "Unexpected server error while sending." });
  }
};
