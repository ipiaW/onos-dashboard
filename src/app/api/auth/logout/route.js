import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const host = request.headers.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const cookieStore = cookies();
  cookieStore.delete("onos_session");

  return NextResponse.redirect(`${appUrl}/`);
}
