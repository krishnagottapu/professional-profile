import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://localhost:8080";

async function proxy(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join("/");
  const search = req.nextUrl.search ?? "";
  const url = `${BACKEND}/api/${path}${search}`;

  // Forward cookie from browser → backend
  const forwardHeaders: Record<string, string> = {};
  const cookie = req.headers.get("cookie");
  if (cookie) forwardHeaders["cookie"] = cookie;

  const ct = req.headers.get("content-type");
  if (ct) forwardHeaders["content-type"] = ct;
  else forwardHeaders["content-type"] = "application/json";

  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  let backendRes: Response;
  try {
    backendRes = await fetch(url, {
      method: req.method,
      headers: forwardHeaders,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err) {
    console.error("[proxy] Backend unreachable:", err);
    return NextResponse.json(
      { error: "Backend unavailable" },
      { status: 503 }
    );
  }

  const resBody = backendRes.status === 204 ? null : await backendRes.text();

  const res = new NextResponse(resBody, {
    status: backendRes.status,
  });

  // Forward content-type
  const resCt = backendRes.headers.get("content-type");
  if (resCt) res.headers.set("content-type", resCt);

  // Forward ALL Set-Cookie headers, stripping SameSite=None and Secure
  // so they work over plain HTTP on localhost
  const rawHeaders = backendRes.headers as unknown as {
    getSetCookie?: () => string[];
    raw?: () => Record<string, string[]>;
  };

  // getSetCookie() is available in Node 18+ fetch / undici
  const setCookies: string[] =
    typeof rawHeaders.getSetCookie === "function"
      ? rawHeaders.getSetCookie()
      : backendRes.headers.get("set-cookie")
      ? [backendRes.headers.get("set-cookie")!]
      : [];

  for (const sc of setCookies) {
    const cleaned = sc
      .replace(/;\s*SameSite=[^;]*/gi, "")
      .replace(/;\s*Secure(?=;|$)/gi, "");
    res.headers.append("set-cookie", cleaned);
  }

  return res;
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
export async function OPTIONS(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, await ctx.params);
}
