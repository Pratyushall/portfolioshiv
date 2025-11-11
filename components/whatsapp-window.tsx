"use client";

import React from "react";

export default function WhatsAppWindow({
  onClose,
  onMinimize,
}: {
  onClose: () => void;
  onMinimize: () => void;
}) {
  return (
    <div className="absolute bottom-14 right-6 w-[360px] bg-white rounded-md shadow-2xl border border-emerald-300 overflow-hidden">
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
