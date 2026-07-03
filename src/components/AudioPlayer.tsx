import { useEffect, useState, useRef } from "react";
import { Play, Pause, Music, Volume2, VolumeX, RefreshCw, AlertCircle } from "lucide-react";

interface AudioPlayerProps {
  song: string;
  album: string;
  autoPlay?: boolean;
  theme?: "dark" | "daylight";
}

interface TrackData {
  previewUrl: string;
  title: string;
  album: string;
  coverUrl: string;
  artist: string;
}

export default function AudioPlayer({ song, album, autoPlay = false, theme = "dark" }: AudioPlayerProps) {
  const [track, setTrack] = useState<TrackData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30); // Previews are typically 30s
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Fetch Sabaton preview on song change
  useEffect(() => {
    let active = true;
    setIsPlaying(false);
    setCurrentTime(0);
    setTrack(null);
    setError(null);
    setLoading(true);

    // Stop current audio if any
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    fetch(`/api/sabaton-preview?song=${encodeURIComponent(song)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        if (data.error) {
          setError(data.error);
        } else if (data.previewUrl) {
          setTrack({
            previewUrl: data.previewUrl,
            title: data.title || song,
            album: data.album || album,
            coverUrl: data.coverUrl || "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=200",
            artist: data.artist || "Sabaton"
          });
          
          // Create new audio element
          const audio = new Audio(data.previewUrl);
          audio.volume = volume;
          audio.loop = false;
          
          audio.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
          };

          audio.ondurationchange = () => {
            setDuration(audio.duration || 30);
          };

          audio.onplay = () => {
            setIsPlaying(true);
          };

          audio.onpause = () => {
            setIsPlaying(false);
          };

          audioRef.current = audio;
        } else {
          setError("No preview available");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to load preview:", err);
        setError("Error al conectar de forma remota");
        setLoading(false);
      });

    return () => {
      active = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [song]);

  // Update current playback time tracker
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Sync volume of audio node
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Sync playback with tour autoplay state
  useEffect(() => {
    if (autoPlay && audioRef.current && !isPlaying && track) {
      audioRef.current.play().catch((err) => {
        console.warn("Playback blocked by browser autoplay policy:", err);
      });
    } else if (!autoPlay && audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
  }, [autoPlay, track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Playback failed:", err));
    }
  };

  const skipTo = (percent: number) => {
    if (!audioRef.current) return;
    const targetTime = percent * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const isDaylight = theme === "daylight";
  return (
    <div className={`border rounded-xl p-4 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-4 transition-all ${
      isDaylight
        ? "bg-[#f5ebd6] border-amber-900/25 text-neutral-800 shadow-md font-typewriter"
        : "bg-[#0d0d0f] border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-slate-200"
    }`}>
      {/* Background Military Grid Accent */}
      {!isDaylight && (
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-red-600/5 to-transparent pointer-events-none" />
      )}
      {isDaylight && (
        <div className="absolute inset-0 bg-[radial-gradient(#b45309_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />
      )}

      {/* Track Info Cover */}
      <div className="flex items-center gap-3 shrink-0">
        <div className={`w-14 h-14 rounded-lg border flex items-center justify-center relative overflow-hidden group ${
          isDaylight ? "bg-[#e6dcc4] border-amber-900/25" : "bg-slate-950 border-white/10"
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full w-full">
              <RefreshCw className={`w-5 h-5 animate-spin ${isDaylight ? "text-red-700" : "text-red-500"}`} />
            </div>
          ) : track?.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={song}
              className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? "scale-105 rotate-3" : ""}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isDaylight
                ? "bg-gradient-to-tr from-amber-800 to-amber-600 opacity-90"
                : "bg-gradient-to-tr from-red-900 to-amber-600 opacity-80"
            }`}>
              <Music className="w-6 h-6 text-white" />
            </div>
          )}

          {/* Audio Visualizer Waves overlay */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex gap-0.5 items-end justify-center pb-2 px-1">
              <div className="w-1 bg-red-600 animate-[bounce_0.6s_infinite_alternate]" style={{ height: "30%" }}></div>
              <div className="w-1 bg-red-600 animate-[bounce_0.4s_infinite_alternate-reverse_0.15s]" style={{ height: "50%" }}></div>
              <div className="w-1 bg-red-600 animate-[bounce_0.5s_infinite_alternate_0.1s]" style={{ height: "70%" }}></div>
              <div className="w-1 bg-red-600 animate-[bounce_0.3s_infinite_alternate_0.2s]" style={{ height: "40%" }}></div>
            </div>
          )}
        </div>

        <div>
          <span className={`text-[9px] uppercase tracking-widest block font-bold font-mono ${
            isDaylight ? "text-red-800" : "text-red-500/80"
          }`}>SABATON RECORD</span>
          <h4 className={`tracking-wide text-sm font-bold truncate w-40 md:w-48 leading-tight ${
            isDaylight ? "text-neutral-900" : "text-white font-serif"
          }`}>
            {song}
          </h4>
          <span className={`text-[11px] block truncate w-40 md:w-48 ${
            isDaylight ? "text-neutral-600" : "text-slate-400 font-sans"
          }`}>
            Álbum: {album}
          </span>
        </div>
      </div>

      {loading ? (
        <div className={`flex-1 flex justify-center text-xs py-2 ${isDaylight ? "text-neutral-500" : "text-slate-400 font-mono"}`}>
          Buscando pre-escucha...
        </div>
      ) : error ? (
        <div className={`flex-1 flex items-center justify-center gap-2 text-xs py-2 px-3 border rounded ${
          isDaylight
            ? "border-red-700/30 bg-red-50 text-red-900 font-mono"
            : "border-red-500/20 bg-red-500/5 text-slate-300 font-mono"
        }`}>
          <AlertCircle className={`w-4 h-4 shrink-0 ${isDaylight ? "text-red-700" : "text-red-500"}`} />
          <span>No disponible: {error === "No preview available" ? "Pre-escucha no disponible" : error}</span>
        </div>
      ) : track ? (
        /* Player Controls & Track bar */
        <div className="flex-1 flex flex-col gap-2">
          {/* Controls row */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className={`w-10 h-10 rounded-full text-white flex items-center justify-center active:scale-95 transition-all focus:outline-none cursor-pointer ${
                isDaylight
                  ? "bg-red-800 hover:bg-red-900 shadow-[0_3px_8px_rgba(153,27,27,0.3)]"
                  : "bg-red-600 hover:bg-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.4)]"
              }`}
              title={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-white text-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
              )}
            </button>

            {/* Simulated Live Visualizer (Jump lines) */}
            <div className={`flex-1 flex items-center text-xs select-none pb-0.5 pointer-events-none h-6 overflow-hidden ${isDaylight ? "text-neutral-500 font-bold" : "text-slate-500 font-mono"}`}>
              <div className={`mr-2 hidden lg:block text-[10px] uppercase tracking-wide`}>Frecuencia:</div>
              <div className="flex-1 flex items-end justify-between h-4 px-1 gap-[3px]">
                {Array.from({ length: 18 }).map((_, i) => {
                  const baseHeight = [20, 60, 40, 80, 50, 30, 90, 70, 40, 80, 60, 20, 50, 80, 40, 70, 30, 50][i];
                  return (
                    <div
                      key={i}
                      className="w-[3px] rounded-full origin-bottom"
                      style={{
                        height: isPlaying ? `${baseHeight}%` : "15%",
                        backgroundColor: isPlaying
                          ? (i % 3 === 0 ? (isDaylight ? "#b91c1c" : "#dc2626") : (isDaylight ? "#92400e" : "#7f1d1d"))
                          : (isDaylight ? "#ebdcb9" : "#27272a"),
                        transition: "height 0.15s ease-in-out",
                        animation: isPlaying ? `bounce_0.${(i%4)+3}s_infinite_alternate` : "none"
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Volume control */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleMuteToggle}
                className={`transition-colors p-1 cursor-pointer ${isDaylight ? "text-neutral-600 hover:text-neutral-900" : "text-slate-400 hover:text-white"}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className={`w-4 h-4 ${isDaylight ? "text-red-700" : "text-red-500"}`} />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className={`w-16 h-1 rounded-lg appearance-none cursor-pointer ${
                  isDaylight
                    ? "bg-amber-900/20 accent-red-800"
                    : "bg-white/10 accent-red-600"
                }`}
              />
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] w-8 text-right ${isDaylight ? "text-neutral-600 font-bold" : "text-slate-400 font-mono"}`}>
              {formatTime(currentTime)}
            </span>
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                skipTo(pos);
              }}
              className={`flex-1 h-1.5 rounded-full cursor-pointer relative group overflow-hidden ${isDaylight ? "bg-amber-900/10" : "bg-white/10"}`}
            >
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-75"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                  backgroundColor: isDaylight ? "#b91c1c" : "#dc2626"
                }}
              />
            </div>
            <span className={`text-[10px] w-8 ${isDaylight ? "text-neutral-600 font-bold" : "text-slate-400 font-mono"}`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      ) : (
        <div className={`flex-1 flex justify-center text-xs py-2 ${isDaylight ? "text-neutral-500" : "text-slate-500 font-mono"}`}>
          No cargada
        </div>
      )}
    </div>
  );
}
