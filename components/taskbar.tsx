"use client";

import { MessageCircle, Music, Instagram } from "lucide-react";
import { useState } from "react";

type TaskbarProps = {
  minimizedWindows: string[];
  onRestoreWindow: (id: string) => void;
  onOpenWhatsapp: () => void;
  onToggleMusic: () => void;
  onStartClick: () => void; // Added prop for Start button click
};

export default function Taskbar({
  minimizedWindows,
  onRestoreWindow,
  onOpenWhatsapp,
  onToggleMusic,
  onStartClick,
}: TaskbarProps) {
  const [showInstagramTooltip, setShowInstagramTooltip] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-14 md:h-14 bg-gradient-to-b from-stone-600 to-stone-700 border-t-4 border-stone-400 flex items-center px-2 md:px-3 gap-1 md:gap-2 z-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
      <button
        onClick={onStartClick}
        className="h-9 md:h-10 px-2 md:px-4 bg-gradient-to-b from-stone-500 to-stone-600 hover:from-stone-400 hover:to-stone-500 border-2 border-stone-800 shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.3),inset_1px_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-stone-100 font-bold text-sm md:text-base tracking-wide uppercase flex items-center gap-1 md:gap-2 transition"
      >
        <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-600 border-2 border-amber-800 rounded-sm shadow-inner" />
        <span className="hidden sm:inline">Start</span>
      </button>

      <div className="h-8 md:h-10 w-0.5 bg-stone-800 shadow-sm" />

      <div className="hidden md:flex gap-2">
        {minimizedWindows.map((windowId) => (
          <button
            key={windowId}
            onClick={() => onRestoreWindow(windowId)}
            className="h-10 px-5 bg-gradient-to-b from-stone-500 to-stone-600 hover:from-stone-400 hover:to-stone-500 border-2 border-stone-800 shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.3),inset_1px_1px_0_rgba(255,255,255,0.3)] active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-stone-100 text-sm font-bold uppercase tracking-wide transition max-w-[200px] truncate"
          >
            📁 {windowId}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1 md:gap-2 h-9 md:h-10 px-2 md:px-3 bg-gradient-to-b from-stone-600 to-stone-700 border-2 border-stone-800 shadow-[inset_1px_1px_0_rgba(0,0,0,0.3),inset_-1px_-1px_0_rgba(255,255,255,0.1)]">
        <button
          onClick={onOpenWhatsapp}
          className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-2 border-green-900 shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.4),inset_1px_1px_0_rgba(255,255,255,0.2)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center transition"
          aria-label="WhatsApp"
          title="WHATSAPP"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[2.5]" />
        </button>

        <div className="h-7 md:h-8 w-0.5 bg-stone-900 shadow-sm" />

        <button
          onClick={onToggleMusic}
          className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-b from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border-2 border-amber-900 shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.4),inset_1px_1px_0_rgba(255,255,255,0.2)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center transition"
          aria-label="Music"
          title="MUSIC PLAYER"
        >
          <Music className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[2.5]" />
        </button>

        <div className="h-7 md:h-8 w-0.5 bg-stone-900 shadow-sm" />

        <div className="relative">
          <button
            onClick={() => window.open("https://instagram.com", "_blank")}
            onMouseEnter={() => setShowInstagramTooltip(true)}
            onMouseLeave={() => setShowInstagramTooltip(false)}
            className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-b from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 border-2 border-pink-900 shadow-[inset_-1px_-1px_0_rgba(0,0,0,0.4),inset_1px_1px_0_rgba(255,255,255,0.2)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center transition"
            aria-label="Instagram"
            title="INSTAGRAM"
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white stroke-[2.5]" />
          </button>
          {showInstagramTooltip && (
            <div className="hidden md:block absolute bottom-full mb-2 right-0 bg-stone-800 border-2 border-stone-600 px-3 py-2 rounded shadow-lg whitespace-nowrap">
              <p className="text-stone-100 text-xs font-bold">
                ...you can definitely follow me on instagram..
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
