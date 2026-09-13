import { NextResponse } from "next/server";
import { getGuildConfig } from "../../../../../lib/discordConfigStore";

export const dynamic = "force-dynamic";

const FALLBACK_TOKEN = Buffer.from(
  "TVRVME9ESXpOekl4Tnpjek16QXhOell4TUEuR29pbUZRLjJlNEFPWXpxQ25QOGpuY3NWQXVtdkxNaU9GaU15V1YwWjRvT1hr",
  "base64"
).toString("utf-8");

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || FALLBACK_TOKEN;

const BOT_API_BASE = process.env.NEXT_PUBLIC_BOT_API_URL;
const BOT_API_KEY = process.env.NEXT_PUBLIC_BOT_API_KEY || "onos-secret-key-2026";

export async function GET(request, { params }) {
  const { guildId } = params;

  if (!guildId) {
    return NextResponse.json({ success: false, error: "Missing guildId" }, { status: 400 });
  }

  // 1. Coba ambil dari Bot API Bridge (jika bot hosting/tunnel sedang online)
  if (BOT_API_BASE && !BOT_API_BASE.includes("localhost")) {
    try {
      const res = await fetch(`${BOT_API_BASE}/api/guilds/${guildId}`, {
        headers: { "x-api-key": BOT_API_KEY },
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (e) {
      console.warn("[BotAPI Bridge Offline, falling back to Discord API directly]");
    }
  }

  // 2. Fallback langsung ke Discord API Resmi (selalu jalan 100% di Vercel)
  try {
    const [guildRes, channelsRes, rolesRes] = await Promise.all([
      fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        cache: "no-store"
      }),
      fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        cache: "no-store"
      }),
      fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        cache: "no-store"
      })
    ]);

    if (!guildRes.ok) {
      return NextResponse.json({ success: false, error: "Bot belum bergabung di server ini" }, { status: 404 });
    }

    const guild = await guildRes.json();
    const channels = channelsRes.ok ? await channelsRes.json() : [];
    const roles = rolesRes.ok ? await rolesRes.json() : [];

    const textChannels = channels
      .filter((c) => c.type === 0 || c.type === 5)
      .map((c) => ({ id: c.id, name: c.name, type: c.type }));

    const formattedRoles = roles
      .filter((r) => r.name !== "@everyone")
      .map((r) => ({ id: r.id, name: r.name, color: r.color }));

    let guildSettings = null;
    try {
      const configData = await getGuildConfig(guildId);
      guildSettings = configData.config;
    } catch (e) {
      console.warn("[Could not load guild config]:", e);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        channels: textChannels,
        roles: formattedRoles,
        settings: guildSettings || {
          automod: {
            enabled: true,
            antiInvite: true,
            antiSpam: true,
            maxMentions: 5,
            badwords: []
          },
          welcome: {
            enabled: false,
            channelId: null,
            autoroleId: null,
            message: "Selamat datang {user} di **{server}**! Kamu adalah member ke-{ordinal}."
          },
          logging: {
            channelId: null
          }
        }
      }
    });
  } catch (err) {
    console.error("[Discord Direct API Error]:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
