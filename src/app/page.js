"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBotStats } from "../lib/botApi";
import { Music, Shield, UserCheck, Sliders, Radio, Sparkles, Server, Users, ArrowRight } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getBotStats()
      .then(res => { if (res.success) setStats(res.data); })
      .catch(() => {});
  }, []);

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1548237217733017610"}&permissions=8&scope=bot%20applications.commands`;

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 px-4 text-center">
        {/* Glow circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#1DB954]/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161c] border border-[#262632] text-xs font-semibold text-[#1DB954]">
            <Sparkles className="w-3.5 h-3.5" /> Full-System Discord Bot & Web Dashboard
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Kelola Musik & Moderasi Server dengan{" "}
            <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
              onoS Bot
            </span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Sistem Discord terintegrasi: Pemutar audio DisTube dengan remote interaktif, perlindungan AutoMod ala Carl-bot & YAGPDB, audit logging lengkap, dan dashboard web real-time yang tersimpan ke file JSON lokal Anda.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-base transition-all shadow-lg shadow-[#1DB954]/25 flex items-center gap-2"
            >
              Masuk ke Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#191920] hover:bg-[#22222c] border border-[#2b2b38] text-white font-semibold text-base transition-all flex items-center gap-2"
            >
              Undang ke Discord
            </a>
          </div>

          {/* Quick live stats */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10">
              <div className="p-4 rounded-2xl bg-[#131318]/90 border border-[#202029] backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{stats.guildCount}</div>
                <div className="text-xs text-neutral-400 font-medium mt-1 flex items-center justify-center gap-1">
                  <Server className="w-3.5 h-3.5 text-[#1DB954]" /> Server Aktif
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#131318]/90 border border-[#202029] backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{stats.totalMembers}</div>
                <div className="text-xs text-neutral-400 font-medium mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#1DB954]" /> Anggota Terlindungi
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#131318]/90 border border-[#202029] backdrop-blur-sm">
                <div className="text-2xl font-bold text-[#1DB954]">{stats.ping} ms</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Latensi WebSocket</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#131318]/90 border border-[#202029] backdrop-blur-sm">
                <div className="text-2xl font-bold text-neutral-200">{stats.uptime}</div>
                <div className="text-xs text-neutral-400 font-medium mt-1">Waktu Uptime Bot</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 px-4 bg-[#0e0e12] border-t border-[#1b1b22]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Fitur Terunggul onoS Bot</h2>
            <p className="text-sm text-neutral-400">Semua pengaturan dapat dikontrol langsung dari Web Dashboard ini.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#14141a] border border-[#202028] hover:border-[#1DB954]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center mb-4">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Web Music Controller</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Kendali pemutaran audio real-time langsung dari browser: pause, resume, skip, ubah volume, dan intip daftar antrean lagu tanpa perlu mengetik command di Discord.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14141a] border border-[#202028] hover:border-[#1DB954]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AutoMod Suite Cerdas</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Proteksi otomatis terhadap link server lain (*Anti-Invite*), spam pesan bertubi-tubi (*Anti-Spam*), mention masal, serta penyaring kata kasar (*Badwords blacklist*).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#14141a] border border-[#202028] hover:border-[#1DB954]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Welcome, Autorole & Logs</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Sesuaikan kartu sambutan dengan live preview, berikan peran otomatis kepada member baru, dan catat audit log untuk setiap pesan yang diedit atau dihapus.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
