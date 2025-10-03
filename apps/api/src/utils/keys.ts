import crypto from "crypto";

export function generateApiKey(): { key: string; hash: string } {
  const raw = `sk_${crypto.randomBytes(24).toString("base64url")}`;
  const hash = hashKey(raw);
  return { key: raw, hash };
}

export function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}
