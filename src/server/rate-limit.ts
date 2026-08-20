import { createHash } from "node:crypto";

export async function enforceEmailRateLimit(identifier: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return process.env.NODE_ENV !== "production";
  const key = `himap:email:${createHash("sha256").update(identifier).digest("hex")}`;
  const response = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify([["INCR", key], ["EXPIRE", key, 60, "NX"]])
  });
  if (!response.ok) {
    console.error("Email rate limit unavailable", { status: response.status });
    return false;
  }
  const values = await response.json() as { result?: number }[];
  return Number(values[0]?.result ?? 99) <= 5;
}
