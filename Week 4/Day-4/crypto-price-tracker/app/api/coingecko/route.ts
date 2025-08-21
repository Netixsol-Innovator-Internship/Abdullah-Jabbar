// file: app/api/coingecko/route.ts
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE = process.env.COINGECKO_API_BASE || "https://api.coingecko.com/api/v3";

// Allowed endpoints to forward. Extend cautiously.
const ALLOWLIST = new Set<string>([
  "/coins/markets",
  "/coins/%ID%/market_chart",
  "/coins/%ID%"
]);

function isAllowed(endpoint: string) {
  if (endpoint === "/coins/markets") return true;
  if (endpoint.startsWith("/coins/") && endpoint.endsWith("/market_chart")) return true;
  if (/^\/coins\/[^/]+$/.test(endpoint)) return true;
  return false;
}

export async function GET(req: NextRequest) {
  // Accept ?endpoint=/coins/markets&... OR ?endpoint=/coins/{id}/market_chart&...
  const url = new URL(req.url);
  const endpoint = url.searchParams.get("endpoint");
  if (!endpoint || !endpoint.startsWith("/")) {
    return NextResponse.json({ error: "Missing or invalid endpoint" }, { status: 400 });
  }
  if (!isAllowed(endpoint)) {
    return NextResponse.json({ error: "Endpoint not allowed" }, { status: 400 });
  }

  // Forward all query params except "endpoint"
  const forward = new URL(DEFAULT_BASE + endpoint);
  url.searchParams.forEach((value, key) => {
    if (key !== "endpoint") forward.searchParams.set(key, value);
  });

  try {
    const res = await fetch(forward.toString(), {
      headers: { "Accept": "application/json" },
      next: { revalidate: 0 } // proxy should be live
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/json",
        "Cache-Control": "public, max-age=30, s-maxage=30" // small edge cache
      }
    });
  } catch (e) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }
}
