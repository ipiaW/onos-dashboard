"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGuildDetails, updateAutoMod } from "../../../../lib/botApi";
import { ShieldAlert, Check, Plus, Trash2, Save, AlertCircle } from "lucide-react";

export default function AutoModSettings() {
  const params = useParams();
  const guildId = params?.guildId;

  const [settings, setSettings] = useState({
    enabled: false,
    antiInvite: false,
    antiSpam: false,
    maxMentions: 5,
    badwords: []
  });

  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (guildId) {
      getGuildDetails(guildId)
        .then(res => {
          if (res.success && res.data.settings.automod) {
            setSettings(res.data.settings.automod);
          }
          setLoading(false);
        })
        .catch(err => {
          setErrorMsg(err.message);
          setLoading(false);
        });
    }
  }, [guildId]);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddBadword = (e) => {
    e.preventDefault();
    const word = newWord.trim().toLowerCase();
    if (!word) return;
    if (settings.badwords?.includes(word)) return;

    setSettings(prev => ({
      ...prev,
      badwords: [...(prev.badwords || []), word]
    }));
    setNewWord("");
  };

  const handleRemoveBadword = (targetWord) => {
    setSettings(prev => ({
      ...prev,
      badwords: (prev.badwords || []).filter(w => w !== targetWord)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateAutoMod(guildId, settings);
      setSuccessMsg("Pengaturan AutoMod berhasil disimpan ke data/automod.json lokal!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-400 py-10">Memuat pengaturan AutoMod...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-orange-400" /> Pengaturan AutoMod
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Konfigurasi perlindungan otomatis server ala Carl-bot & YAGPDB.xyz.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-neutral-700 text-black font-bold text-sm transition-all shadow-md hover:shadow-[#1DB954]/20 flex items-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-sm flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
        </div>
      )}

      {/* Module Toggles */}
      <div className="space-y-4">
        {/* Main Switch */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Aktifkan AutoMod Utama</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Master switch untuk mengaktifkan seluruh modul AutoMod di server ini.
            </p>
          </div>
          <button
            onClick={() => handleToggle("enabled")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.enabled ? "bg-[#1DB954]" : "bg-[#252530]"
            }`}
          >
            <div
              className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.enabled ? "translate-x-6 bg-black" : "translate-x-0 bg-neutral-400"
              }`}
            ></div>
          </button>
        </div>

        {/* Anti-Invite */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Anti-Invite (Blokir Link Discord)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Otomatis menghapus pesan yang mengandung tautan <code className="text-neutral-300">discord.gg/...</code> dari member biasa.
            </p>
          </div>
          <button
            onClick={() => handleToggle("antiInvite")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.antiInvite ? "bg-[#1DB954]" : "bg-[#252530]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.antiInvite ? "translate-x-6 bg-black" : "translate-x-0 bg-neutral-400"
              }`}
            ></div>
          </button>
        </div>

        {/* Anti-Spam */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Anti-Spam (Deteksi Pengiriman Cepat)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Mendeteksi member yang mengirim lebih dari 5 pesan dalam 3 detik dan memberikan timeout 1 menit secara otomatis.
            </p>
          </div>
          <button
            onClick={() => handleToggle("antiSpam")}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.antiSpam ? "bg-[#1DB954]" : "bg-[#252530]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.antiSpam ? "translate-x-6 bg-black" : "translate-x-0 bg-neutral-400"
              }`}
            ></div>
          </button>
        </div>

        {/* Max Mentions */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Batas Maksimal Mention</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Batas pengiriman mention anggota atau role dalam satu pesan sebelum pesan dihapus.
              </p>
            </div>
            <span className="text-sm font-bold text-[#1DB954] px-3 py-1 bg-[#1DB954]/10 rounded-lg">
              {settings.maxMentions || 5} Mentions
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={settings.maxMentions || 5}
            onChange={(e) => setSettings(prev => ({ ...prev, maxMentions: parseInt(e.target.value, 10) }))}
            className="w-full accent-[#1DB954] bg-[#22222d] h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Badwords List */}
        <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Daftar Kata Terlarang (Badwords Blacklist)</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Pesan yang mengandung salah satu kata di bawah ini akan langsung dihapus oleh bot onoS.
            </p>
          </div>

          <form onSubmit={handleAddBadword} className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan kata terlarang baru..."
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#1c1c24] border border-[#2c2c38] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#1DB954]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[#242430] hover:bg-[#1DB954] text-neutral-300 hover:text-black font-semibold text-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </form>

          {/* Badword Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(!settings.badwords || settings.badwords.length === 0) && (
              <span className="text-xs text-neutral-500 italic">Belum ada kata terlarang yang didaftarkan.</span>
            )}
            {settings.badwords?.map((word) => (
              <span
                key={word}
                className="px-3 py-1.5 rounded-lg bg-[#1b1b24] border border-[#292938] text-xs text-neutral-200 flex items-center gap-2 group"
              >
                {word}
                <button
                  type="button"
                  onClick={() => handleRemoveBadword(word)}
                  className="text-neutral-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
