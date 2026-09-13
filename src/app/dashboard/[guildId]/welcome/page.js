"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGuildDetails, updateWelcome } from "../../../../lib/botApi";
import { UserPlus, Save, Check, AlertCircle, Eye } from "lucide-react";

export default function WelcomeSettings() {
  const params = useParams();
  const guildId = params?.guildId;

  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [guildName, setGuildName] = useState("");
  const [settings, setSettings] = useState({
    channelId: "",
    message: "Selamat datang {user} di **{server}**! Kamu adalah **{server} {ordinal} member** 🎉",
    autoroleId: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (guildId) {
      getGuildDetails(guildId)
        .then(res => {
          if (res.success) {
            setChannels(res.data.channels || []);
            setRoles(res.data.roles || []);
            setGuildName(res.data.name || "Server");
            if (res.data.settings.welcome) {
              setSettings({
                channelId: res.data.settings.welcome.channelId || "",
                message: res.data.settings.welcome.message || "Selamat datang {user} di **{server}**! Kamu adalah **{server} {ordinal} member** 🎉",
                autoroleId: res.data.settings.welcome.autoroleId || ""
              });
            }
          }
          setLoading(false);
        })
        .catch(err => {
          setErrorMsg(err.message);
          setLoading(false);
        });
    }
  }, [guildId]);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await updateWelcome(guildId, settings);
      setSuccessMsg("Pengaturan Sambutan & Autorole berhasil disimpan ke data/welcome.json lokal!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  };

  // Preview formatted text
  const previewText = settings.message
    .replace(/{user}/g, "@Username")
    .replace(/{username}/g, "Username")
    .replace(/{server}/g, guildName || "on.oS")
    .replace(/{ordinal}/g, "35th")
    .replace(/{memberCount}/g, "35");

  if (loading) return <div className="text-neutral-400 py-10">Memuat pengaturan Sambutan...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-emerald-400" /> Sambutan & Autorole
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Atur ucapan selamat datang, penomoran ordinal member, dan peran otomatis anggota baru.
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

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form Inputs */}
        <div className="space-y-5">
          {/* Welcome Channel Dropdown */}
          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-2">
            <label className="text-sm font-bold text-white block">Saluran Sambutan (Welcome Channel)</label>
            <p className="text-xs text-neutral-400">Pilih channel tempat kartu sambutan akan dikirim.</p>
            <select
              value={settings.channelId}
              onChange={(e) => setSettings(prev => ({ ...prev, channelId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c24] border border-[#2c2c38] text-sm text-white focus:outline-none focus:border-[#1DB954]"
            >
              <option value="">-- Nonaktifkan Sambutan --</option>
              {channels.map(c => (
                <option key={c.id} value={c.id}>#{c.name}</option>
              ))}
            </select>
          </div>

          {/* Autorole Dropdown */}
          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-2">
            <label className="text-sm font-bold text-white block">Peran Otomatis (Autorole)</label>
            <p className="text-xs text-neutral-400">Peran yang otomatis diberikan saat member baru bergabung.</p>
            <select
              value={settings.autoroleId}
              onChange={(e) => setSettings(prev => ({ ...prev, autoroleId: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1c1c24] border border-[#2c2c38] text-sm text-white focus:outline-none focus:border-[#1DB954]"
            >
              <option value="">-- Nonaktifkan Autorole --</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>@{r.name}</option>
              ))}
            </select>
          </div>

          {/* Message Template Textarea */}
          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-2">
            <label className="text-sm font-bold text-white block">Template Pesan Sambutan</label>
            <textarea
              rows={4}
              value={settings.message}
              onChange={(e) => setSettings(prev => ({ ...prev, message: e.target.value }))}
              className="w-full p-3 rounded-xl bg-[#1c1c24] border border-[#2c2c38] text-sm text-white focus:outline-none focus:border-[#1DB954] resize-none"
            />
            <div className="text-[11px] text-neutral-400 bg-[#171720] p-3 rounded-xl border border-[#262633] space-y-1">
              <span className="font-semibold text-neutral-300 block">Variabel yang Didukung:</span>
              <div><code className="text-[#1DB954]">{"{user}"}</code> = Mention anggota baru (@User)</div>
              <div><code className="text-[#1DB954]">{"{server}"}</code> = Nama server</div>
              <div><code className="text-[#1DB954]">{"{ordinal}"}</code> = Urutan member (contoh: 35th)</div>
              <div><code className="text-[#1DB954]">{"{memberCount}"}</code> = Total anggota (contoh: 35)</div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div>
          <div className="sticky top-24 p-6 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Eye className="w-4 h-4 text-[#1DB954]" /> Live Preview di Discord
            </div>

            <div className="border-l-4 border-[#1DB954] pl-4 py-2 bg-[#171720] rounded-r-xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-[#1DB954]"></span>
                <span>{guildName || "on.oS"} • 35th Member</span>
              </div>

              <h4 className="font-bold text-white text-base">
                🎉 Selamat Datang di {guildName || "on.oS"}!
              </h4>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {previewText}
              </p>

              <div className="pt-2 border-t border-[#23232f] text-xs text-neutral-400 space-y-1">
                <div>🔢 Posisi Bergabung: <span className="text-white font-semibold">{guildName || "on.oS"} 35th member</span></div>
                <div>🎂 Akun Dibuat: <span className="text-neutral-300">2 tahun, 4 bulan yang lalu</span></div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 italic text-center">
              Pesan di atas adalah gambaran persis bagaimana sambutan akan tampil di server Discord Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
