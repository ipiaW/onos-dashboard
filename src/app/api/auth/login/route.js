import { NextResponse } from "next/server";

export async function GET(request) {
  const host = request.headers.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610";
  const redirectUri = `${appUrl}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds",
    prompt: "consent"
  });

  const discordAuthUrl = `https://discord.com/oauth2/authorize?${params.toString()}`;

  return NextResponse.redirect(discordAuthUrl);
}
