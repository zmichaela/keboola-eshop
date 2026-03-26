import dotenv from "dotenv";
import express from "express";

import { KbcError, listBuckets, listTables } from "./kbc.js";

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());

app.all("/", (_req, res) => {
  // Keboola Data Apps sends POST / on startup; accept it locally too.
  res.json({
    message: "hello keboola",
    name: "keboola-eshop",
    status: "ok",
    kbc_url: process.env.KBC_URL,
    has_kbc_token: Boolean(process.env.KBC_TOKEN)
  });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/hello", (_req, res) => {
  res.json({ message: "hello keboola" });
});

app.get("/api/buckets", async (_req, res, next) => {
  try {
    res.json({ buckets: await listBuckets() });
  } catch (e) {
    next(e);
  }
});

app.get("/api/tables", async (_req, res, next) => {
  try {
    res.json({ tables: await listTables() });
  } catch (e) {
    next(e);
  }
});

app.use((err, _req, res, _next) => {
  if (err instanceof KbcError) {
    res.status(500).json({ error: err.message, status: err.status, bodyPreview: err.bodyPreview });
    return;
  }
  res.status(500).json({ error: err?.message || String(err) });
});

const PORT = Number(process.env.PORT || 8050);
app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`keboola-eshop listening on http://127.0.0.1:${PORT}`);
});

