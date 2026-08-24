import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint untuk bypass CORS dari cdn.dos.zone
// Usage: /api/dos-bundle?game=tyrian-2000
const ALLOWED_GAMES: Record<string, string> = {
  "tyrian-2000": "https://cdn.dos.zone/custom/dos/tyrian-2000.jsdos",
  "tyrian": "https://cdn.dos.zone/custom/dos/tyrian.jsdos",
};

export async function GET(req: NextRequest) {
  const game = req.nextUrl.searchParams.get("game") ?? "tyrian-2000";
  const bundleUrl = ALLOWED_GAMES[game];

  if (!bundleUrl) {
    return new NextResponse("Game not found", { status: 404 });
  }

  try {
    const upstream = await fetch(bundleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Tyrian-Proxy/1.0)",
        Accept: "application/octet-stream, application/zip, */*",
      },
      // Next.js server-side fetch tidak terkena CORS
    });

    if (!upstream.ok) {
      return new NextResponse(`Upstream error: ${upstream.status}`, {
        status: upstream.status,
      });
    }

    const contentType =
      upstream.headers.get("content-type") ?? "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400, immutable", // Cache 1 hari
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("[dos-bundle proxy] fetch error:", err);
    return new NextResponse("Failed to fetch bundle", { status: 502 });
  }
}
