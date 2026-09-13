import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK_TOKEN = Buffer.from(
  "TVRVME9ESXpOekl4Tnpjek16QXhOell4TUEuR29pbUZRLjJlNEFPWXpxQ25QOGpuY3NWQXVtdkxNaU9GaU15V1YwWjRvT1hr",
  "base64"
).toString("utf-8");

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || FALLBACK_TOKEN;

export async function GET() {
  try {
    const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Discord Bot Guilds Error]:", err);
      return NextResponse.json({ success: false, error: err, data: [] });
    }

    const guilds = await res.json();
    return NextResponse.json({
      success: true,
      data: guilds.map((g) => ({
        id: g.id,
        name: g.name,
        icon: g.icon
          ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=128`
          : null
      }))
    });
  } catch (err) {
    console.error("[Bot Guilds Exception]:", err);
    return NextResponse.json({ success: false, error: err.message, data: [] });
  }
}
