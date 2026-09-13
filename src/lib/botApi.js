const API_BASE = process.env.NEXT_PUBLIC_BOT_API_URL || "http://localhost:4000";
const API_KEY = process.env.NEXT_PUBLIC_BOT_API_KEY || "onos-secret-key-2026";

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || "Gagal memproses request ke Bot API");
    }
    return await res.json();
  } catch (error) {
    console.error(`[BotAPI Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export async function getBotStats() {
  const res = await fetch(`${API_BASE}/api/stats`);
  return await res.json();
}

export async function getGuilds() {
  return await fetchWithAuth("/api/guilds");
}

export async function getGuildDetails(guildId) {
  return await fetchWithAuth(`/api/guilds/${guildId}`);
}

export async function updateAutoMod(guildId, data) {
  return await fetchWithAuth(`/api/guilds/${guildId}/automod`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateWelcome(guildId, data) {
  return await fetchWithAuth(`/api/guilds/${guildId}/welcome`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateLogging(guildId, channelId) {
  return await fetchWithAuth(`/api/guilds/${guildId}/logging`, {
    method: "POST",
    body: JSON.stringify({ channelId })
  });
}

export async function getMusicStatus(guildId) {
  return await fetchWithAuth(`/api/guilds/${guildId}/music`);
}

export async function controlMusic(guildId, action, value = null) {
  return await fetchWithAuth(`/api/guilds/${guildId}/music/control`, {
    method: "POST",
    body: JSON.stringify({ action, value })
  });
}
