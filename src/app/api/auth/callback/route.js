import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getBaseUrl } from "../../../../lib/authHelper";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const appUrl = getBaseUrl(request);
  const redirectUri = `${appUrl}/api/auth/callback`;

  // Jika user membatalkan / Discord mengembalikan error
  if (error || !code) {
    const errorMsg = errorDescription || error || "Tidak ada kode otorisasi dari Discord";
    return NextResponse.redirect(`${appUrl}/dashboard?auth_error=${encodeURIComponent(errorMsg)}`);
  }

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610";
  const clientSecret = process.env.DISCORD_CLIENT_SECRET || "8l_CiWHdnE8CqQIljW4jt9f0mEf7vY1c";

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
      const errText = await tokenResponse.text();
      console.error("[OAuth2 Token Error]:", errText);
      return NextResponse.redirect(
        `${appUrl}/dashboard?auth_error=${encodeURIComponent("Gagal menukar token dengan Discord. Pastikan Redirect URI di Discord Developer Portal sama persis dengan: " + redirectUri)}`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Ambil profil user Discord (@me)
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (!userResponse.ok) {
      return NextResponse.redirect(`${appUrl}/dashboard?auth_error=Gagal_mengambil_profil_user`);
    }
    
    const userData = await userResponse.json();

    // 3. Ambil daftar server pengguna (@me/guilds)
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const guildsData = guildsResponse.ok ? await guildsResponse.json() : [];

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

    // 4. Simpan session ke cookie
    const isLocal = appUrl.includes("localhost") || appUrl.includes("127.0.0.1");
    const cookieStore = cookies();
    cookieStore.set("onos_session", JSON.stringify(sessionPayload), {
      httpOnly: true,
      secure: !isLocal && (process.env.NODE_ENV === "production"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch (err) {
    console.error("[OAuth2 Callback Exception]:", err);
    return NextResponse.redirect(`${appUrl}/dashboard?auth_error=${encodeURIComponent(err.message || "Exception saat login")}`);
  }
}
