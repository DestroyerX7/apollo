import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  //   const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  //   if (!sessionCookie) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // I think this is secure because it uses getSession which validates the session cookie
  // So you dont need to check in ech page
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/new-chat", "/chat/:path"], // Specify the routes the middleware applies to
};
