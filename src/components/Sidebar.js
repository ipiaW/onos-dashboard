"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  UserPlus,
  FileText,
  Music2,
  ArrowLeft
} from "lucide-react";

export default function Sidebar({ guildId, guildName, guildIcon }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Ringkasan Server", icon: LayoutDashboard, href: `/dashboard/${guildId}` },
    { label: "AutoMod System", icon: ShieldAlert, href: `/dashboard/${guildId}/automod` },
    { label: "Welcome & Autorole", icon: UserPlus, href: `/dashboard/${guildId}/welcome` },
    { label: "Audit ModLogs", icon: FileText, href: `/dashboard/${guildId}/logs` },
    { label: "Web Music Player", icon: Music2, href: `/dashboard/${guildId}/music` }
  ];

  return (
    <aside className="w-full md:w-64 bg-[#111116] border-b md:border-b-0 md:border-r border-[#1f1f26] p-4 flex flex-col justify-between shrink-0">
      <div>
        {/* Guild Header */}
        <div className="flex items-center gap-3 p-2 mb-6 rounded-xl bg-[#16161c] border border-[#262630]">
          {guildIcon ? (
            <img src={guildIcon} alt={guildName} className="w-10 h-10 rounded-xl object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-[#2a2a35] flex items-center justify-center font-bold text-neutral-300">
              {guildName ? guildName.charAt(0) : "S"}
            </div>
          )}
          <div className="overflow-hidden">
            <h2 className="font-bold text-sm text-white truncate">{guildName || "Server"}</h2>
            <span className="text-[11px] text-[#1DB954] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]"></span> onoS Aktif
            </span>
          </div>
        </div>

        {/* Nav list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#1DB954] text-black font-semibold shadow-md shadow-[#1DB954]/20"
                    : "text-neutral-400 hover:text-white hover:bg-[#191920]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-neutral-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to server selector */}
      <div className="pt-4 border-t border-[#1f1f26]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors p-2"
        >
          <ArrowLeft className="w-4 h-4" /> Ganti Server
        </Link>
      </div>
    </aside>
  );
}
