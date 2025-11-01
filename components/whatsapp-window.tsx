"use client";

import React, { useEffect, useState } from "react";

export default function WhatsAppWindow({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    // 📱 MOBILE VERSION – bottom sheet
    return (
      <div className="fixed inset-0 z-1100 flex items-end justify-center bg-black/35">
        <div className="w-full max-h-[78vh] bg-white rounded-t-3xl shadow-2xl border-t border-emerald-200 overflow-hidden">
          {/* sheet header */}
          <div className="pt-3 pb-2 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/90 flex items-center justify-center text-xs font-semibold text-white">
                WA
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Contact on WhatsApp
                </p>
                <p className="text-[11px] text-slate-500">
                  I’ll reply as soon as I can ✨
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={onMinimize}
                className="w-7 h-7 text-xs rounded-full bg-slate-100 text-slate-600"
              >
                _
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 text-xs rounded-full bg-slate-100 text-slate-600"
              >
                ×
              </button>
            </div>
          </div>

          {/* drag handle */}
          <div className="w-12 h-1.5 rounded-full bg-slate-200 mx-auto mb-3" />

          {/* body */}
          <div className="px-4 pb-5 overflow-y-auto max-h-[62vh] space-y-3">
            <div className="text-xs text-slate-600 leading-relaxed">
              You can reach me at{" "}
              <span className="font-semibold text-emerald-600">
                +91-80086 36217
              </span>{" "}
              or just drop a note here 👇
            </div>
            <form className="space-y-2.5">
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <input
                type="text"
                placeholder="WhatsApp no. / email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <textarea
                placeholder="Tell me what you need…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white text-sm py-2 rounded-lg font-medium active:scale-[0.995] transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 🖥 DESKTOP VERSION – your original one
  return (
    <div className="absolute bottom-14 right-6 w-[360px] bg-white rounded-md shadow-2xl border border-emerald-300 overflow-hidden z-500">
      <div className="flex items-center justify-between px-3 py-2 bg-emerald-500 text-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">
            WA
          </div>
          <span className="text-sm font-medium">Contact on WhatsApp</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onMinimize}
            className="w-5 h-5 text-xs rounded bg-white/15"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 text-xs rounded bg-white/15"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="text-xs text-slate-600">
          You can reach me at{" "}
          <span className="font-semibold text-emerald-600">
            +91-80086 36217
          </span>{" "}
          or just drop a note here 👇
        </div>
        <form className="space-y-2">
          <input
            type="text"
            placeholder="Your name"
            className="w-full border border-slate-200 rounded px-2 py-1 text-sm"
          />
          <input
            type="text"
            placeholder="WhatsApp no. / email"
            className="w-full border border-slate-200 rounded px-2 py-1 text-sm"
          />
          <textarea
            placeholder="Tell me what you need…"
            className="w-full border border-slate-200 rounded px-2 py-1 text-sm min-h-[70px]"
          />
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white text-sm py-1.5 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
