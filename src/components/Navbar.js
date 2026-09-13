"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getBotStats } from "../lib/botApi";
import { Radio, LogOut, ExternalLink } from "lucide-react";

export default function Navbar() {
  const [stats, setStats] = useState(null);
  const [auth, setAuth] = useState({ loggedIn: false, user: null });
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Ambil statistik bot
    getBotStats()
      .then(res => { if (res.success) setStats(res.data); })
      .catch(() => {});

    // Periksa status login Discord
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setAuth(data);
        setLoadingAuth(false);
      })
      .catch(() => setLoadingAuth(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0b0e]/80 border-b border-[#1f1f26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1DB954] to-[#12883c] flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              onoS
            </span>
            <span className="text-xs text-[#1DB954] font-semibold block tracking-wider uppercase">
              Dashboard
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            Beranda
          </Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">
            Server Saya
          </Link>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Dokumentasi <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* Action & User Status */}
        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16161a] border border-[#23232b] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse"></span>
              <span className="text-neutral-300 font-medium">{stats.ping} ms</span>
            </div>
          )}

          {!loadingAuth && auth.loggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#171720] hover:bg-[#20202c] border border-[#2b2b3b] transition-all"
              >
                <img
                  src={auth.user.avatar}
                  alt={auth.user.username}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-sm font-semibold text-white truncate max-w-[120px]">
                  {auth.user.globalName || auth.user.username}
                </span>
              </Link>
              <a
                href="/api/auth/logout"
                className="p-2 rounded-xl bg-[#1b1b24] hover:bg-red-950/40 hover:text-red-400 border border-[#272736] text-neutral-400 transition-colors"
                title="Logout dari Discord"
              >
                <LogOut className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/login"
              className="px-4 py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm transition-all shadow-md hover:shadow-[#5865F2]/25 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.894a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login with Discord
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
