#!/usr/bin/env node

const { createServer } = require("node:http");
const { readFileSync, existsSync } = require("node:fs");
const { resolve } = require("node:path");

const port = Number.parseInt(process.env.EXTENSIONS_API_PORT ?? "3011", 10);
const catalogPath = process.env.EXTENSIONS_CATALOG_PATH
  ? resolve(process.env.EXTENSIONS_CATALOG_PATH)
  : resolve(__dirname, "extensions-api-catalog.sample.json");

const readCatalog = () => {
  if (!existsSync(catalogPath)) {
    throw new Error(`Catalog file not found: ${catalogPath}`);
  }

  return JSON.parse(readFileSync(catalogPath, "utf8"));
};

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(body));
};

createServer((req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: "Bad request" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method !== "GET") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  if (req.url === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.url === "/api/v1/extensions") {
    try {
      sendJson(res, 200, readCatalog());
    } catch (error) {
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  if (req.url === "/api/v2/saleor-apps") {
    // This endpoint is currently not consumed by the Explore view in this dashboard branch.
    sendJson(res, 200, { apps: [] });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}).listen(port, () => {
  console.log(`Extensions API server running on http://localhost:${port}`);
  console.log(`Serving catalog from: ${catalogPath}`);
});
