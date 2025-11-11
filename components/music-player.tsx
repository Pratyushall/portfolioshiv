"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";

export default function MusicPlayer({
  onClose,
  audioRef,
}: {
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

  // path to your mp3 (put it in /public/audio/...)
  const src = "/audio/pranav-theme.mp3";

  // try to autoplay when the player opens
  useEffect(() => {
    if (audioRef.current) {
      // make sure src is set
      if (audioRef.current.src.endsWith(src) === false) {
        audioRef.current.src = src;
      }
      audioRef.current.loop = true;
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
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
      ref={playerRef}
      className="fixed cursor-move select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-48 bg-gradient-to-b from-stone-600 via-stone-700 to-stone-600 rounded-xl shadow-2xl border-2 border-stone-800 p-3">
        {/* Top decorative stripe */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-stone-700 to-stone-800 rounded-t-xl border-b border-stone-900 flex items-center justify-between px-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-800 shadow-inner"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-900 shadow-inner"></div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-4 h-4 rounded-sm bg-stone-800 hover:bg-stone-900 flex items-center justify-center text-stone-400 text-[10px] font-bold shadow-md transition-colors cursor-pointer"
            onMouseDown={(e) => e.stopPropagation()}
          >
            ✕
          </button>
        </div>

        {/* Brand name */}
        <div className="mt-3 mb-2 text-center">
          <h2 className="text-[9px] font-bold text-stone-300 tracking-widest">
            RETRO SOUNDS
          </h2>
          <p className="text-[7px] text-stone-400 italic">
            Compact Disc Player
          </p>
        </div>

        {/* CD Display window */}
        <div className="relative bg-stone-950 rounded-lg p-2 mb-2 shadow-inner border border-stone-800">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/50 to-transparent rounded-lg pointer-events-none"></div>

          {/* Spinning CD effect */}
          <div className="relative mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-900 via-amber-800 to-stone-700 shadow-lg flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "3s" }}
            >
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 shadow-inner"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-950 shadow-xl"></div>
            </div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-700 shadow-inner z-10"></div>
            <div className="absolute w-4 h-4 rounded-full bg-stone-950 shadow-xl z-20"></div>
          </div>

          {/* LED Display */}
          <div className="mt-2 bg-stone-950 rounded px-1.5 py-0.5 text-center border border-stone-900">
            <p className="text-amber-700 text-[9px] font-mono tracking-wider">
              {isPlaying ? "► PLAYING" : "❚❚ PAUSED"}
            </p>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full bg-gradient-to-b from-stone-600 via-stone-700 to-stone-600 shadow-lg border border-stone-800 flex items-center justify-center hover:from-stone-500 hover:via-stone-600 hover:to-stone-500 transition-all active:shadow-inner cursor-pointer"
          >
            {isPlaying ? (
              <svg
                className="w-4 h-4 text-stone-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-4 h-4 text-stone-300 ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMute();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full bg-gradient-to-b from-stone-600 via-stone-700 to-stone-600 shadow-lg border border-stone-800 flex items-center justify-center hover:from-stone-500 hover:via-stone-600 hover:to-stone-500 transition-all active:shadow-inner cursor-pointer"
          >
            {isMuted ? (
              <svg
                className="w-3.5 h-3.5 text-stone-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.63 3.63a1 1 0 0 0 0 1.41L7.29 8.7 7 9H4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 5a1 1 0 0 0 1.707-.707V13.41l5.953 5.953a1 1 0 0 0 1.414-1.414l-16-16a1 1 0 0 0-1.414 0zM12 4.293a1 1 0 0 0-1.707-.707L7.707 6.172 12 10.465V4.293zm4.536 2.121-1.414 1.414A4 4 0 0 1 17 11a4.019 4.019 0 0 1-.93 2.56l1.414 1.414A6 6 0 0 0 19 11a5.98 5.98 0 0 0-2.464-4.586z" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 text-stone-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>
        </div>

        {/* hidden audio element */}
        <audio ref={audioRef} src={src} />

        {/* Bottom speaker grille */}
        <div className="flex justify-center gap-1 opacity-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 h-0.5 rounded-full bg-stone-500"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
