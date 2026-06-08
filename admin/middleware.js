import { NextResponse } from "next/server";
import { verifyToken }  from "@/lib/jwt";

const PUBLIC_PATHS = ["/login"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Allow API auth routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("admin_token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};