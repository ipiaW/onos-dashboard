"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getGuildDetails } from "../../../lib/botApi";
import { ShieldAlert, UserPlus, FileText, Music2, CheckCircle2, ArrowRight } from "lucide-react";

export default function GuildOverview() {
  const params = useParams();
  const guildId = params?.guildId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (guildId) {
      getGuildDetails(guildId)
        .then(res => {
          if (res.success) setData(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [guildId]);

  if (loading) {
    return <div className="text-neutral-400 py-10">Memuat data server...</div>;
  }

  if (!data) {
    return <div className="text-red-400 py-10">Server tidak ditemukan atau Bot belum terhubung.</div>;
  }

  const { settings, channels, roles } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Ringkasan Pengaturan Server</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Kelola seluruh modul bot onoS untuk server <span className="text-white font-semibold">{data.name}</span>.
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212a]">
          <span className="text-xs text-neutral-400 block mb-1">Status AutoMod</span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${settings.automod?.enabled ? "bg-[#1DB954]" : "bg-neutral-600"}`}></span>
            <span className="text-lg font-bold text-white">
              {settings.automod?.enabled ? "Aktif" : "Nonaktif"}
            </span>
          </div>
          <span className="text-[11px] text-neutral-500 mt-2 block">
            Anti-Invite: {settings.automod?.antiInvite ? "ON" : "OFF"} • Anti-Spam: {settings.automod?.antiSpam ? "ON" : "OFF"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212a]">
          <span className="text-xs text-neutral-400 block mb-1">Channel Sambutan</span>
          <div className="text-lg font-bold text-white truncate">
            {settings.welcome?.channelId ? `#${channels.find(c => c.id === settings.welcome.channelId)?.name || "channel"}` : "Belum diatur"}
          </div>
          <span className="text-[11px] text-neutral-500 mt-2 block">
            Autorole: {settings.welcome?.autoroleId ? `@${roles.find(r => r.id === settings.welcome.autoroleId)?.name || "role"}` : "Nonaktif"}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212a]">
          <span className="text-xs text-neutral-400 block mb-1">Audit ModLog</span>
          <div className="text-lg font-bold text-white truncate">
            {settings.logging?.channelId ? `#${channels.find(c => c.id === settings.logging.channelId)?.name || "channel"}` : "Belum diatur"}
          </div>
          <span className="text-[11px] text-neutral-500 mt-2 block">
            Mencatat pesan & aksi moderator
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212a]">
          <span className="text-xs text-neutral-400 block mb-1">Total Saluran Teks</span>
          <div className="text-lg font-bold text-white">
            {channels.length} Saluran
          </div>
          <span className="text-[11px] text-neutral-500 mt-2 block">
            {roles.length} Peran Terdeteksi
          </span>
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href={`/dashboard/${guildId}/automod`}
          className="p-6 rounded-2xl bg-[#14141a] border border-[#21212a] hover:border-[#1DB954]/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-[#1DB954] transition-colors">
                Konfigurasi AutoMod
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Atur Anti-Invite, Anti-Spam, batas mention, dan daftar kata terlarang.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href={`/dashboard/${guildId}/welcome`}
          className="p-6 rounded-2xl bg-[#14141a] border border-[#21212a] hover:border-[#1DB954]/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-[#1DB954] transition-colors">
                Sambutan & Autorole
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Kustomisasi template sambutan dengan live preview dan peran otomatis.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href={`/dashboard/${guildId}/logs`}
          className="p-6 rounded-2xl bg-[#14141a] border border-[#21212a] hover:border-[#1DB954]/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-[#1DB954] transition-colors">
                Audit Logging (ModLogs)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tentukan saluran teks untuk menerima catatan aktivitas server.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href={`/dashboard/${guildId}/music`}
          className="p-6 rounded-2xl bg-[#14141a] border border-[#21212a] hover:border-[#1DB954]/50 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-[#1DB954] transition-colors">
                Web Music Player
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Kontrol pemutaran musik real-time, volume, dan antrean lagu.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
