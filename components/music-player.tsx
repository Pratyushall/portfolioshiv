// components/music-player.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function MusicPlayer({
  onClose,
  audioRef,
}: {
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // path to your mp3 (put it in /public/audio/...)
  const src = "/audio/pranav-theme.mp3"; // 👈 change this to your file

  // try to autoplay when the player opens
  useEffect(() => {
    if (audioRef.current) {
      // make sure src is set
      if (audioRef.current.src.endsWith(src) === false) {
        audioRef.current.src = src;
      }
      audioRef.current.loop = true; // keep it going
      audioRef.current.muted = false;

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // browser blocked autoplay — show as paused
          setIsPlaying(false);
        });
    }
  }, [audioRef, src]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleMute = () => {
    if (!audioRef.current) return;
    const next = !isMuted;
    audioRef.current.muted = next;
    setIsMuted(next);
  };

  return (
    <div
      className="absolute top-16 right-6 w-60 bg-white/70 backdrop-blur-md border border-white/30 rounded-xl shadow-lg p-3 flex flex-col gap-2"
      style={{ zIndex: 999 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-800">YT Music</p>
          <p className="text-[10px] text-slate-500 truncate"></p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md bg-slate-200/70 flex items-center justify-center text-xs text-slate-700 hover:bg-slate-300/80"
        >
          ✕
        </button>
      </div>

      {/* hidden audio element */}
      <audio ref={audioRef} src={src} />

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handlePlayPause}
          className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={handleMute}
          className="px-3 py-1 bg-white/80 border border-slate-200 rounded-md text-xs text-slate-700"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 mt-1"></p>
    </div>
  );
}
