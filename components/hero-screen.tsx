"use client";

import React, { useState } from "react";

type HeroScreenProps = {
  suggestions: string[];
  onSuggestionClick: () => void;
  onSearch: () => void;
};

export default function HeroScreen({
  suggestions,
  onSuggestionClick,
  onSearch,
}: HeroScreenProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // when they type anything at all, open desktop
    if (value.trim().length > 0) {
      onSearch();
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(circle at top, #C63957 0%, #941e38 50%, #4f0f1f 100%)",
      }}
    >
      {/* optional texture image */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/hero-blur.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* BIG HEADERS */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight text-center drop-shadow-md">
          Look it up, open it!
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#39C6A8] tracking-tight text-center drop-shadow">
          I won’t stop you...
        </h2>

        {/* SEARCH BAR WRAPPER */}
        <div className="relative w-[min(520px,90vw)]">
          <div
            className="bg-white/85 rounded-full flex items-center border shadow-sm px-4 py-2.5 gap-3"
            style={{ borderColor: "#39C6A8" }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#39C6A8" }}
            />
            <input
              type="text"
              placeholder="Search... scenes, theatre, reels, BTS"
              className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // small delay so we can click suggestion
                setTimeout(() => setIsFocused(false), 150);
              }}
              value={query}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />
            <button
              onClick={onSearch}
              className="bg-[#39C6A8] text-white rounded-full px-5 py-1.5 text-sm font-medium hover:opacity-90 transition"
            >
              Search
            </button>
          </div>

          {/* SUGGESTIONS DROPDOWN WITH SCROLLBAR */}
          {(isFocused || query.length > 0) && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-[#39C6A8]/40 rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-52 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      onSuggestionClick();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:bg-[#C63957]/5 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-white/70 mt-2"></p>
      </div>
    </div>
  );
}
