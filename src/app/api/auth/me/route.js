import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("onos_session");

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ loggedIn: false, user: null, guilds: [] });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    return NextResponse.json({
      loggedIn: true,
      user: session.user,
      guilds: session.guilds || []
    });
  } catch (e) {
    return NextResponse.json({ loggedIn: false, user: null, guilds: [] });
  }
}
