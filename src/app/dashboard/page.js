"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getGuilds } from "../../lib/botApi";
import { ShieldCheck, ArrowRight, PlusCircle, LogIn, Lock } from "lucide-react";

export default function ServerSelector() {
  const [auth, setAuth] = useState({ loggedIn: false, user: null, guilds: [] });
  const [botGuilds, setBotGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi user Discord
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(sessionData => {
        setAuth(sessionData);

        // 2. Ambil daftar server yang ada bot onoS
        return getGuilds()
          .then(botRes => {
            if (botRes.success) setBotGuilds(botRes.data);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610";

  // Jika belum login ke Discord
  if (!loading && !auth.loggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] flex items-center justify-center mx-auto shadow-lg shadow-[#5865F2]/10">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white">Login Discord Diperlukan</h1>
          <p className="text-sm text-neutral-400">
            Masuk dengan akun Discord Anda untuk mengelola server yang Anda kelola (memiliki izin <i>Manage Server</i> atau <i>Administrator</i>).
          </p>
        </div>

        <div>
          <a
            href="/api/auth/login"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-base transition-all shadow-lg shadow-[#5865F2]/25"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Masuk dengan Akun Discord
          </a>
        </div>
      </div>
    );
  }

  // Gabungkan server user dengan status bot
  const botGuildIds = new Set(botGuilds.map(b => b.id));
  const userGuilds = auth.guilds || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 w-full">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Halo, {auth.user?.globalName || auth.user?.username}! 👋
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Berikut adalah daftar server yang Anda kelola. Pilih server untuk membuka panel kontrol onoS.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-neutral-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Menyinkronkan server Discord Anda...</p>
        </div>
      )}

      {!loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGuilds.map((guild) => {
            const hasBot = botGuildIds.has(guild.id);
            const inviteServerUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`;

            return (
              <div
                key={guild.id}
                className="p-6 rounded-2xl bg-[#14141a] border border-[#22222c] hover:border-[#1DB954]/50 hover:shadow-xl hover:shadow-[#1DB954]/5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {guild.icon ? (
                      <img
                        src={guild.icon}
                        alt={guild.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#2b2b38]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-[#23232f] border border-[#2b2b38] flex items-center justify-center font-bold text-lg text-white">
                        {guild.name.charAt(0)}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h2 className="font-bold text-base text-white truncate group-hover:text-[#1DB954] transition-colors">
                        {guild.name}
                      </h2>
                      <span className="text-xs text-neutral-400 block mt-0.5">
                        {guild.owner ? "Owner Server" : "Administrator / Mod"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    {hasBot ? (
                      <span className="px-2.5 py-1 rounded-md bg-[#1DB954]/10 text-[#1DB954] text-[11px] font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> onoS Terpasang
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-400 text-[11px] font-semibold">
                        onoS Belum Bergabung
                      </span>
                    )}
                  </div>
                </div>

                {hasBot ? (
                  <Link
                    href={`/dashboard/${guild.id}`}
                    className="w-full py-2.5 rounded-xl bg-[#1e1e26] group-hover:bg-[#1DB954] text-white group-hover:text-black font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    Buka Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <a
                    href={inviteServerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#5865F2] text-neutral-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 border border-[#2b2b3b]"
                  >
                    <PlusCircle className="w-4 h-4" /> Pasang onoS Bot
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
