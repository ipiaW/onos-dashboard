"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGuildDetails, updateLogging } from "../../../../lib/botApi";
import { FileText, Save, Check, AlertCircle, Shield, MessageSquare, UserCheck, AlertTriangle } from "lucide-react";

export default function LoggingSettings() {
  const params = useParams();
  const guildId = params?.guildId;

  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
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
            setSelectedChannel(res.data.settings.logging?.channelId || "");
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
      await updateLogging(guildId, selectedChannel);
      setSuccessMsg("Saluran ModLog berhasil disimpan ke data/logging.json lokal!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Gagal menyimpan saluran log.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-neutral-400 py-10">Memuat pengaturan ModLog...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" /> Audit Logging (ModLogs)
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Pencatatan transparan aktivitas server, tindakan moderator, pesan diedit/dihapus, dan riwayat member.
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

      {/* Channel Selector */}
      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-3">
        <label className="text-base font-bold text-white block">Saluran Pencatatan Log (ModLog Channel)</label>
        <p className="text-xs text-neutral-400">
          Pilih channel teks tempat bot onoS akan mengirimkan seluruh laporan audit server.
        </p>

        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-[#1c1c24] border border-[#2c2c38] text-sm text-white focus:outline-none focus:border-[#1DB954]"
        >
          <option value="">-- Nonaktifkan ModLog --</option>
          {channels.map(c => (
            <option key={c.id} value={c.id}>#{c.name}</option>
          ))}
        </select>
      </div>

      {/* Features Logged List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Aktivitas yang Akan Dicatat Otomatis:</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Pesan Dihapus (Message Delete)</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Menampilkan pengirim, channel, dan isi pesan lengkap yang baru saja dihapus.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Pesan Diedit (Message Update)</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Menampilkan perbandingan teks sebelum dan sesudah perubahan beserta tautan pesan.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Member In & Out (Join / Leave)</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Mencatat nomor urut ordinal (e.g. 35th member), kalkulasi usia akun, dan status keamanan.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#14141a] border border-[#21212b] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Aksi Moderasi Resmi</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Mencatat tindakan Ban, Unban, Kick, Timeout, Warn, dan Purge beserta nama moderator dan alasannya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
