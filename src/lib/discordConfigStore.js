const FALLBACK_TOKEN = Buffer.from(
  "TVRVME9ESXpOekl4Tnpjek16QXhOell4TUEuR29pbUZRLjJlNEFPWXpxQ25QOGpuY3NWQXVtdkxNaU9GaU15V1YwWjRvT1hr",
  "base64"
).toString("utf-8");

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || FALLBACK_TOKEN;
const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610";

const DEFAULT_CONFIG = {
  version: 1,
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
};

async function discordFetch(endpoint, options = {}) {
  const url = `https://discord.com/api/v10${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Discord API Error [${res.status}]: ${errText}`);
  }

  return await res.json().catch(() => null);
}

// 1. Cari atau buat channel #onos-config di guild
export async function getOrCreateConfigChannel(guildId) {
  const channels = await discordFetch(`/guilds/${guildId}/channels`);
  let configChannel = channels.find((c) => c.name === "onos-config" && c.type === 0);

  if (!configChannel) {
    configChannel = await discordFetch(`/guilds/${guildId}/channels`, {
      method: "POST",
      body: JSON.stringify({
        name: "onos-config",
        type: 0,
        topic: "Konfigurasi Otomatis onoS Bot & Web Dashboard (Jangan dihapus)",
        permission_overwrites: [
          {
            id: guildId, // @everyone
            type: 0,
            deny: "1024" // Deny VIEW_CHANNEL
          },
          {
            id: CLIENT_ID,
            type: 1,
            allow: "3072" // Allow VIEW_CHANNEL + SEND_MESSAGES
          }
        ]
      })
    });
  }

  return configChannel;
}

// 2. Ambil config aktif dari pinned message
export async function getGuildConfig(guildId) {
  try {
    const channel = await getOrCreateConfigChannel(guildId);
    const pins = await discordFetch(`/channels/${channel.id}/pins`);

    if (pins && pins.length > 0) {
      const configMsg = pins[0];
      const parsed = JSON.parse(configMsg.content);
      return {
        channelId: channel.id,
        messageId: configMsg.id,
        config: { ...DEFAULT_CONFIG, ...parsed }
      };
    }

    // Jika belum ada pinned message, buat pesan awal
    const newMsg = await discordFetch(`/channels/${channel.id}/messages`, {
      method: "POST",
      body: JSON.stringify({
        content: JSON.stringify(DEFAULT_CONFIG, null, 2)
      })
    });

    await discordFetch(`/channels/${channel.id}/pins/${newMsg.id}`, {
      method: "PUT"
    });

    return {
      channelId: channel.id,
      messageId: newMsg.id,
      config: DEFAULT_CONFIG
    };
  } catch (err) {
    console.error("[getGuildConfig Error]:", err);
    return {
      channelId: null,
      messageId: null,
      config: DEFAULT_CONFIG
    };
  }
}

// 3. Simpan perubahan config ke pinned message
export async function updateGuildConfig(guildId, section, updates) {
  const current = await getGuildConfig(guildId);
  const updatedConfig = {
    ...current.config,
    [section]: {
      ...(current.config[section] || {}),
      ...updates
    },
    updatedAt: new Date().toISOString()
  };

  if (current.channelId && current.messageId) {
    await discordFetch(`/channels/${current.channelId}/messages/${current.messageId}`, {
      method: "PATCH",
      body: JSON.stringify({
        content: JSON.stringify(updatedConfig, null, 2)
      })
    });
  }

  return updatedConfig;
}
