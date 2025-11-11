"use client";

import type React from "react";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StickyNoteProps = {
  onClose: () => void;
};

export default function StickyNote({ onClose }: StickyNoteProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffsetRef.current.x,
        y: e.clientY - dragOffsetRef.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  return (
    <div
      className="absolute w-80 bg-yellow-100 border-4 border-yellow-300 shadow-[4px_4px_12px_rgba(0,0,0,0.4)] rounded-sm"
      style={{ left: position.x, top: position.y, zIndex: 100 }}
    >
      {/* Header bar - draggable */}
      <div
        onMouseDown={handleMouseDown}
        className="h-8 bg-gradient-to-b from-yellow-300 to-yellow-400 border-b-2 border-yellow-400 flex items-center justify-between px-3 cursor-move"
      >
        <span className="text-yellow-900 font-bold text-sm uppercase tracking-wide">
          Sticky Note
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 bg-red-600 hover:bg-red-500 border-2 border-red-800 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white stroke-[3]" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-stone-900 text-base leading-relaxed font-handwriting">
          Hi, I'm Shiva Pranav. I'm an aspiring actor and this is my portfolio.
          Hope you like it and if you do, send me a message!
        </p>
      </div>
    </div>
  );
}
