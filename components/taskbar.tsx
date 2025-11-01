"use client";

import React from "react";

export default function Taskbar({
  minimizedWindows,
  onRestoreWindow,
  onOpenWhatsapp,
  onToggleMusic,
}: {
  minimizedWindows: string[];
  onRestoreWindow: (id: string) => void;
  onOpenWhatsapp: () => void;
  onToggleMusic: () => void;
}) {
  return (
    <div
      className="absolute bottom-3 left-3 right-3 h-12
      bg-white/10 backdrop-blur-md
      border border-white/20
      rounded-xl
      flex items-center px-4
      shadow-[0_10px_35px_rgba(0,0,0,0.25)]
      "
    >
      {/* center apps */}
      <div className="flex-1 flex items-center justify-center gap-3">
        {/* YouTube Music */}
        <button
          onClick={onToggleMusic}
          className="w-8 h-8 rounded-md bg-white/80 shadow-sm border border-white/20 flex items-center justify-center"
          title="YT Music"
        >
          <div className="w-5 h-5 rounded-full bg-[#FF0000] flex items-center justify-center">
            <div className="w-2 h-2 border-l-[6px] border-l-white border-y-4 border-y-transparent translate-x-px" />
          </div>
        </button>

        {/* Netflix */}
        <div
          className="w-8 h-8 rounded-md bg-black/85 shadow-sm flex items-center justify-center"
          title="Netflix"
        >
          <span className="text-[#e50914] text-[11px] font-bold leading-none">
            N
          </span>
        </div>

        {/* Prime Video */}
        <div
          className="w-8 h-8 rounded-md bg-white/80 shadow-sm border border-white/20 flex items-center justify-center"
          title="Prime Video"
        >
          <span className="text-sky-500 text-[10px] font-semibold leading-none">
            prime
          </span>
        </div>

        {/* WhatsApp + text */}
        <button
          onClick={onOpenWhatsapp}
          className="flex items-center gap-1 bg-[#22c55e] text-white rounded-md px-2 h-8 shadow-sm"
          title="WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="w-4 h-4" fill="currentColor">
            <path d="M16 3C9.4 3 4 8.1 4 14.4c0 2.7 1.1 5.1 3 7.1L5.5 27 10 25.6c1.8 1 3.8 1.5 6 1.5 6.6 0 12-5.1 12-11.4C28 8.1 22.6 3 16 3z" />
          </svg>
          <span className="text-[10px] font-medium leading-none">
            contact me
          </span>
        </button>

        {/* minimized windows */}
        {minimizedWindows.length > 0 && (
          <div className="flex items-center gap-2 ml-3">
            {minimizedWindows.map((id) => (
              <button
                key={id}
                onClick={() => onRestoreWindow(id)}
                className="px-3 py-1 bg-white/70 rounded-sm text-xs shadow-sm border border-white/30 text-slate-800"
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Instagram CTA on the extreme right */}
      <a
        href="https://www.instagram.com/usernamepranav/"
        target="_blank"
        rel="noreferrer"
        className="ml-auto flex items-center gap-2 text-[11px] text-white/90 hover:text-white transition"
      >
        <span className="w-7 h-7 rounded-lg bg-linear-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="5" ry="5" />
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="16" cy="8" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span>you can definitely follow me on Instagram!</span>
      </a>
    </div>
  );
}
