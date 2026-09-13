import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const host = request.headers.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/?auth_error=${encodeURIComponent(error || "No code provided")}`);
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610";
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/callback`;

  try {
    // 1. Tukar authorization code dengan access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri
      }).toString()
    });

    if (!tokenResponse.ok) {
      const errData = await tokenResponse.text();
      console.error("[OAuth2 Token Error]:", errData);
      return NextResponse.redirect(`${appUrl}/?auth_error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Ambil profil user Discord (@me)
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userData = await userResponse.json();

    // 3. Ambil daftar server pengguna (@me/guilds)
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const guildsData = await guildsResponse.json();

    // Filter server yang bisa dikelola (memiliki izin Manage Guild atau Administrator atau Owner)
    // Manage Guild: 0x20 (32), Administrator: 0x8 (8)
    const manageableGuilds = Array.isArray(guildsData)
      ? guildsData
          .filter((guild) => {
            if (guild.owner) return true;
            try {
              const perms = BigInt(guild.permissions);
              return (perms & 0x20n) === 0x20n || (perms & 0x8n) === 0x8n;
            } catch (e) {
              return false;
            }
          })
          .map((guild) => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
              : null,
            owner: guild.owner
          }))
      : [];

    const sessionPayload = {
      user: {
        id: userData.id,
        username: userData.username,
        discriminator: userData.discriminator,
        globalName: userData.global_name || userData.username,
        avatar: userData.avatar
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=128`
          : "https://cdn.discordapp.com/embed/avatars/0.png"
      },
      guilds: manageableGuilds
    };

    // 4. Simpan session ke cookie yang aman
    const cookieStore = cookies();
    cookieStore.set("onos_session", JSON.stringify(sessionPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch (err) {
    console.error("[OAuth2 Callback Exception]:", err);
    return NextResponse.redirect(`${appUrl}/?auth_error=exception`);
  }
}
