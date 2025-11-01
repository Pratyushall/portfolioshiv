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
  const [pos, setPos] = useState({ x: 0, y: 70 }); // default spot
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  // your mp3 file
  const src = "/audio/pranav-theme.mp3"; // change this to your file

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
        .catch(() => setIsPlaying(false));
    }
  }, [audioRef, src]);

  // global mouse + touch handlers for drag
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;

      let clientX: number;
      let clientY: number;

      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        clientX = t.clientX;
        clientY = t.clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const nextX = clientX - offsetRef.current.x;
      const nextY = clientY - offsetRef.current.y;

      // clamp a bit so it doesn't go fully off-screen
      const maxX =
        (typeof window !== "undefined" ? window.innerWidth : 400) - 200;
      const maxY =
        (typeof window !== "undefined" ? window.innerHeight : 800) - 80;

      setPos({
        x: Math.max(0, Math.min(nextX, maxX)),
        y: Math.max(0, Math.min(nextY, maxY)),
      });
    };

    const handleUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);

      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  const startDragMouse = (e: React.MouseEvent) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const startDragTouch = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    draggingRef.current = true;
    offsetRef.current = {
      x: t.clientX - pos.x,
      y: t.clientY - pos.y,
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
      className="fixed bg-white/80 backdrop-blur-md border border-white/40 rounded-xl shadow-lg p-3 md:w-64 w-72"
      style={{ top: pos.y, left: pos.x, zIndex: 999 }}
    >
      {/* draggable header */}
      <div
        className="flex items-center justify-between gap-2 cursor-move mb-2 touch-none"
        onMouseDown={startDragMouse}
        onTouchStart={startDragTouch}
      >
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

      <p className="text-[10px] text-slate-400 mt-2"></p>
    </div>
  );
}
