import { readFileSync } from "node:fs";

export class KbcError extends Error {
  constructor(message, { status, bodyPreview } = {}) {
    super(message);
    this.name = "KbcError";
    this.status = status;
    this.bodyPreview = bodyPreview;
  }
}

export function loadEnvExplicit() {
  // Avoid dotenv's stack-based discovery; be explicit and predictable.
  try {
    readFileSync(".env");
    return true;
  } catch {
    return false;
  }
}

export function getKbcConfig() {
  const url = (process.env.KBC_URL || "").trim().replace(/\/+$/, "");
  const token = (process.env.KBC_TOKEN || "").trim();

  if (!url) throw new KbcError("Missing environment variable: KBC_URL");
  if (!token) throw new KbcError("Missing environment variable: KBC_TOKEN");

  return { url, token };
}

export async function kbcGet(path, { params } = {}) {
  const { url, token } = getKbcConfig();
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  const u = new URL(`${url}${fullPath}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      u.searchParams.set(k, String(v));
    }
  }

  let res;
  try {
    res = await fetch(u, {
      method: "GET",
      headers: {
        "X-StorageApi-Token": token,
        Accept: "application/json",
        "User-Agent": "keboola-eshop-local/0.1.0"
      }
    });
  } catch (e) {
    throw new KbcError(`Keboola request failed: ${e?.message || String(e)}`);
  }

  const text = await res.text();
  if (!res.ok) {
    throw new KbcError(`Keboola API error ${res.status} for ${fullPath}`, {
      status: res.status,
      bodyPreview: text.slice(0, 500)
    });
  }

  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new KbcError(`Non-JSON response from Keboola for ${fullPath}`, {
      status: res.status,
      bodyPreview: text.slice(0, 500)
    });
  }
}

export function listBuckets() {
  return kbcGet("/v2/storage/buckets");
}

export function listTables() {
  return kbcGet("/v2/storage/tables");
}

