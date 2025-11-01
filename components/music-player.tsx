// components/music-player.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer({
  onClose,
  audioRef,
}: {
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // draggable state
  const [pos, setPos] = useState({ x: 0, y: 70 }); // default near top
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // your mp3 file
  const src = "/audio/pranav-theme.mp3"; // 👈 change to your actual mp3

  // autoplay / loop
  useEffect(() => {
    if (audioRef.current) {
      if (!audioRef.current.src || !audioRef.current.src.includes(src)) {
        audioRef.current.src = src;
      }
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false)); // autoplay blocked
    }
  }, [audioRef, src]);

  // global mouse handlers for drag
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const nextX = e.clientX - offsetRef.current.x;
      const nextY = e.clientY - offsetRef.current.y;
      setPos({
        x: Math.max(nextX, 0),
        y: Math.max(nextY, 0),
      });
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

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
      className="fixed w-64 bg-white/80 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-3"
      style={{ top: pos.y, left: pos.x, zIndex: 999 }}
    >
      {/* draggable header */}
      <div
        className="flex items-center justify-between gap-2 cursor-move mb-2"
        onMouseDown={startDrag}
      >
        <div>
          <p className="text-xs font-semibold text-slate-800">
            YouTube Music (mock)
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            pranav-theme.mp3
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-md bg-slate-200/70 flex items-center justify-center text-xs text-slate-700 hover:bg-slate-300/80"
        >
          ✕
        </button>
      </div>

      {/* audio element */}
      <audio ref={audioRef} src={src} />

      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="px-3 py-1 bg-slate-900 text-white rounded-md text-xs min-w-[60px]"
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

      <p className="text-[10px] text-slate-400 mt-2">
        plays until you pause / mute ✨
      </p>
    </div>
  );
}
