"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMusicStatus, controlMusic } from "../../../../lib/botApi";
import { Music, Play, Pause, SkipForward, Square, Volume2, Radio, ListMusic, RefreshCw } from "lucide-react";

export default function MusicController() {
  const params = useParams();
  const guildId = params?.guildId;

  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [volume, setVolume] = useState(80);

  const fetchStatus = () => {
    if (!guildId) return;
    getMusicStatus(guildId)
      .then(res => {
        if (res.success) {
          setMusic(res.data);
          if (res.data.volume !== undefined) setVolume(res.data.volume);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
    // Auto-polling status musik setiap 3 detik
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [guildId]);

  const handleControl = async (action, value = null) => {
    setActionLoading(true);
    try {
      await controlMusic(guildId, action, value);
      fetchStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
  };

  const handleVolumeCommit = () => {
    handleControl("volume", volume);
  };

  if (loading) return <div className="text-neutral-400 py-10">Memuat status audio player...</div>;

  const currentSong = music?.currentSong;
  const isPlaying = music?.isPlaying;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f1f26] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-[#1DB954]" /> Web Music Controller
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Kendali pemutaran audio real-time dan daftar antrean lagu langsung dari browser.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          className="p-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-neutral-300 transition-colors"
          title="Segarkan data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Now Playing Card */}
      {currentSong ? (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181822] to-[#121218] border border-[#262636] shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {currentSong.thumbnail ? (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.name}
                className="w-36 h-36 rounded-2xl object-cover shadow-lg border border-[#313144] shrink-0"
              />
            ) : (
              <div className="w-36 h-36 rounded-2xl bg-[#232333] flex items-center justify-center text-[#1DB954] shrink-0">
                <Music className="w-12 h-12" />
              </div>
            )}

            <div className="flex-1 space-y-3 text-center sm:text-left overflow-hidden w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-xs font-semibold">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Sedang Diputar
              </div>

              <h2 className="text-xl font-bold text-white truncate" title={currentSong.name}>
                {currentSong.name}
              </h2>

              <p className="text-sm text-neutral-400 truncate">
                {currentSong.uploader || "Artis Tidak Diketahui"}
              </p>

              {/* Progress Duration */}
              <div className="pt-2 text-xs text-neutral-400 flex items-center justify-between">
                <span>00:00</span>
                <span className="font-semibold text-white">{currentSong.formattedDuration}</span>
              </div>
            </div>
          </div>

          {/* Player Remote Buttons */}
          <div className="mt-8 pt-6 border-t border-[#232330] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleControl(isPlaying ? "pause" : "resume")}
                disabled={actionLoading}
                className="w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-[#1DB954]/25"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
              </button>

              <button
                onClick={() => handleControl("skip")}
                disabled={actionLoading}
                className="w-10 h-10 rounded-full bg-[#20202c] hover:bg-[#2c2c3d] text-white flex items-center justify-center transition-colors"
                title="Lewati Lagu"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleControl("stop")}
                disabled={actionLoading}
                className="w-10 h-10 rounded-full bg-[#20202c] hover:bg-red-500/20 hover:text-red-400 text-white flex items-center justify-center transition-colors"
                title="Hentikan Musik"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-3 w-full sm:w-48">
              <Volume2 className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                onMouseUp={handleVolumeCommit}
                onTouchEnd={handleVolumeCommit}
                className="w-full accent-[#1DB954] bg-[#2a2a38] h-1.5 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-semibold text-neutral-300 w-8 text-right">{volume}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-[#14141a] border border-[#21212b] text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#1e1e28] text-neutral-500 flex items-center justify-center mx-auto mb-2">
            <Music className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">Tidak Ada Musik yang Diputar</h3>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Gunakan perintah <code className="text-[#1DB954]">/play &lt;query&gt;</code> di Discord untuk mulai memutar lagu.
          </p>
        </div>
      )}

      {/* Queue List */}
      <div className="p-6 rounded-2xl bg-[#14141a] border border-[#21212b] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#1DB954]" /> Antrean Lagu Berikutnya ({music?.queue?.length || 0})
          </h3>
        </div>

        {(!music?.queue || music.queue.length === 0) ? (
          <p className="text-xs text-neutral-500 italic">Antrean kosong.</p>
        ) : (
          <div className="space-y-2">
            {music.queue.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#1a1a24] border border-[#252535] flex items-center justify-between text-sm hover:border-[#1DB954]/40 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xs font-bold text-neutral-500 w-5 text-center">#{item.position}</span>
                  <span className="font-medium text-white truncate max-w-md">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-neutral-400 shrink-0">{item.formattedDuration}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
