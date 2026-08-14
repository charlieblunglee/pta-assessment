/**
 * POST /api/save-results
 * Saves one completed assessment into the Supabase `submissions` table.
 *
 * HOW IT STAYS SAFE
 * - Runs only on the server. The Supabase service-role key is read from an
 *   encrypted environment variable and is NEVER sent to the browser.
 * - Stores only the approved executive fields — no evidence notes, no uploaded
 *   artifacts, no PHI.
 *
 * SETUP (Vercel → Settings → Environment Variables, Production)
 *   SUPABASE_URL               = https://YOUR-PROJECT.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  = the service-role key from Supabase
 *                                (Project Settings → API → service_role, "secret")
 * Then run `supabase-collect.sql` once in the Supabase SQL Editor to create the
 * `submissions` table. Without these, the app still works; saving is skipped.
 */

const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v) => (v == null ? null : String(v).slice(0, 2000));

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Too many requests." });

  let p = req.body;
  if (typeof p === "string") {
    try { p = JSON.parse(p); } catch { return res.status(400).json({ error: "Invalid JSON" }); }
  }
  if (!p || typeof p !== "object") return res.status(400).json({ error: "Missing body" });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Not configured yet — respond cleanly so the app keeps working.
    return res.status(503).json({ error: "Central storage is not configured." });
  }

  // Whitelist mapping: only these approved fields are stored.
  const row = {
    email: clean(p.email),
    company: clean(p.company),
    line_of_business: clean(p.lineOfBusiness),
    healthcare_track: clean(p.healthcareTrack),
    assessment_date: clean(p.assessmentDate),
    program_score: Number.isFinite(+p.programScore) ? Math.round(+p.programScore) : null,
    maturity: clean(p.maturity),
    recommended_package: clean(p.recommendedPackage),
    primary_focus: clean(p.primaryFocus),
    confidence: clean(p.confidence),
    disposition: clean(p.disposition),
    recommended_further_analysis: clean(p.recommendedFurtherAnalysis),
    immediate_priorities: Array.isArray(p.immediatePriorities) ? p.immediatePriorities.slice(0, 10).map(clean) : [],
  };
  row.payload = row; // keep a full copy of the stored fields as JSON too

  try {
    const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/submissions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error("Supabase insert failed", r.status, detail);
      return res.status(502).json({ error: "Database rejected the record." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("save-results failure", err);
    return res.status(500).json({ error: "Unexpected server error while saving." });
  }
};
