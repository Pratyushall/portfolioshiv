"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Folder } from "@/lib/folders";

type WindowDialogProps = {
  folder: Folder;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
};

export default function WindowDialog({
  folder,
  zIndex,
  onClose,
  onMinimize,
}: WindowDialogProps) {
  // position + size
  const [pos, setPos] = useState({ x: 80, y: 60 });
  const [size, setSize] = useState({ width: 480, height: 360 });
  const [isMax, setIsMax] = useState(false);

  // dragging / resizing
  const winRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // remember last state for restore
  const lastStateRef = useRef({
    x: 80,
    y: 60,
    width: 480,
    height: 360,
  });

  // Pointer listeners (drag/resize) – one path for mouse + touch
  useEffect(() => {
    const header = headerRef.current;
    const resizer = resizeRef.current;
    const win = winRef.current;
    if (!header || !win) return;

    // DRAG
    const onHeaderPointerDown = (e: PointerEvent) => {
      if (isMax) return;
      // don’t start drag if pressing on a button inside header
      const tgt = e.target as HTMLElement;
      if (tgt.closest("button")) return;

      draggingRef.current = true;
      (header as any).setPointerCapture?.(e.pointerId);

      dragOffsetRef.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
      // prevent browser scroll while dragging on touch
      if (e.pointerType === "touch") e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      // RESIZE takes priority
      if (resizingRef.current && !isMax) {
        if (e.pointerType === "touch") e.preventDefault();
        const { x, y, w, h } = resizeStartRef.current;
        const newW = Math.max(320, w + (e.clientX - x));
        const newH = Math.max(220, h + (e.clientY - y));
        setSize({ width: newW, height: newH });
        return;
      }

      // DRAG
      if (!draggingRef.current || isMax) return;
      if (e.pointerType === "touch") e.preventDefault();

      const nextX = e.clientX - dragOffsetRef.current.x;
      const nextY = e.clientY - dragOffsetRef.current.y;

      // clamp inside viewport
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      setPos({
        x: Math.min(Math.max(nextX, 0), Math.max(0, maxX)),
        y: Math.min(Math.max(nextY, 0), Math.max(0, maxY)),
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (draggingRef.current) {
        draggingRef.current = false;
        try {
          (header as any).releasePointerCapture?.(e.pointerId);
        } catch {}
      }
      if (resizingRef.current) {
        resizingRef.current = false;
        try {
          (resizer as any)?.releasePointerCapture?.(e.pointerId);
        } catch {}
      }
    };

    header.addEventListener("pointerdown", onHeaderPointerDown, {
      passive: false,
    });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: false });
    window.addEventListener("pointercancel", onPointerUp, { passive: false });

    // RESIZE
    const onResizerPointerDown = (e: PointerEvent) => {
      if (isMax) return;
      e.stopPropagation();
      resizingRef.current = true;
      (resizer as any)?.setPointerCapture?.(e.pointerId);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        w: size.width,
        h: size.height,
      };
      if (e.pointerType === "touch") e.preventDefault();
    };

    resizer?.addEventListener("pointerdown", onResizerPointerDown, {
      passive: false,
    });

    return () => {
      header.removeEventListener("pointerdown", onHeaderPointerDown as any);
      window.removeEventListener("pointermove", onPointerMove as any);
      window.removeEventListener("pointerup", onPointerUp as any);
      window.removeEventListener("pointercancel", onPointerUp as any);
      resizer?.removeEventListener("pointerdown", onResizerPointerDown as any);
    };
  }, [pos.x, pos.y, size.width, size.height, isMax]);

  const toggleMax = () => {
    if (!isMax) {
      // save
      lastStateRef.current = {
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
      };
      setPos({ x: 0, y: 0 });
      setSize({ width: window.innerWidth, height: window.innerHeight - 48 });
      setIsMax(true);
    } else {
      setPos({ x: lastStateRef.current.x, y: lastStateRef.current.y });
      setSize({
        width: lastStateRef.current.width,
        height: lastStateRef.current.height,
      });
      setIsMax(false);
    }
  };

  // figure out content type
  const hasVideo = !!folder.video;
  const hasText = !!folder.text;
  const hasImages = !!folder.images && folder.images.length > 0;

  return (
    <div
      ref={winRef}
      className="fixed bg-[#f7f8fa] rounded-md shadow-xl border border-slate-200 flex flex-col"
      style={{
        top: pos.y,
        left: pos.x,
        width: size.width,
        height: size.height,
        zIndex,
      }}
    >
      {/* title bar (touch-action: none to enable drag on mobile) */}
      <div
        ref={headerRef}
        className="flex items-center justify-between px-3 py-2 bg-[#e5e8ef] border-b border-slate-200 cursor-move select-none"
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={onClose}
            className="w-3.5 h-3.5 rounded-full bg-[#e81123] border border-[#6f0a13]"
            aria-label="Close"
          />
          <button
            onClick={onMinimize}
            className="w-3.5 h-3.5 rounded-full bg-[#ffb900] border border-[#a97000]"
            aria-label="Minimize"
          />
          <button
            onClick={toggleMax}
            className="w-3.5 h-3.5 rounded-full bg-[#16c60c] border border-[#0f6d09]"
            aria-label="Maximize"
          />
          <span className="ml-3 text-sm font-medium text-slate-800">
            {folder.title}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-wide">
          {hasVideo
            ? "Video"
            : hasText
            ? "Notes"
            : hasImages
            ? "Slideshow"
            : "Empty"}
        </span>
      </div>

      {/* BODY */}
      <div className="flex-1 bg-white overflow-hidden relative">
        {hasVideo ? (
          <VideoPanel src={folder.video!} />
        ) : hasText ? (
          <TextPanel text={folder.text!} />
        ) : hasImages ? (
          <ManualSlideshow images={folder.images!} />
        ) : (
          <EmptyPanel />
        )}

        {/* resize handle (pointer-enabled) */}
        {!isMax && (
          <div
            ref={resizeRef}
            className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize bg-slate-300/70 rounded-sm"
            style={{ touchAction: "none" }}
          />
        )}
      </div>
    </div>
  );
}

function VideoPanel({ src }: { src: string }) {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video
        src={src}
        controls
        className="max-w-full max-h-full rounded-md"
        style={{ background: "black" }}
      />
    </div>
  );
}

function TextPanel({ text }: { text: string }) {
  return (
    <div
      className="w-full h-full overflow-auto p-6 md:p-10"
      style={{ backgroundColor: "#60709F" }}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
        SHIVA PRANAV
      </h1>
      <p className="text-white/95 text-xl md:text-2xl leading-relaxed max-w-3xl mb-5">
        I’m <span className="font-semibold text-white">Shiva Pranav</span>, an
        actor who{" "}
        <span className="font-semibold">found his way back to life</span>{" "}
        through theatre.
      </p>
      <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mb-4">
        When everything felt a little <span className="italic">dim</span>, the
        stage showed up like{" "}
        <span className="font-semibold">a ray of sunshine.</span> I still
        remember deciding, during one ordinary sunset{" "}
        <span className="font-semibold">“this is what I’m going to do.”</span>
      </p>
      <p className="text-white/85 text-lg md:text-xl leading-relaxed max-w-3xl mb-6">
        Since then, the actor in me{" "}
        <span className="font-semibold">hasn’t gone quiet,</span> and{" "}
        <span className="font-semibold">it won’t.</span>
      </p>
      <p className="text-white text-xl md:text-2xl leading-relaxed max-w-3xl mb-4">
        I love <span className="font-semibold">becoming someone else</span> not
        for show, but to see{" "}
        <span className="underline decoration-white/40">
          how deeply I can blend into a character.
        </span>
      </p>
      <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mb-4">
        Big role, small role{" "}
        <span className="font-semibold">it doesn’t matter.</span> What matters
        is: did I disappear into it?
      </p>
      <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
        I genuinely believe{" "}
        <span className="font-semibold">
          I have it in me, whatever it takes.
        </span>{" "}
        Give me a room, a camera, a stage — I’ll show you.
      </p>
      <p className="text-white/70 text-base md:text-lg tracking-tight">
        You’ll know the rest when we work together{" "}
        <span className="inline-block">😉</span>
      </p>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
      No content in this folder
    </div>
  );
}

function ManualSlideshow({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  return (
    <div className="h-full w-full relative bg-white flex items-center justify-center">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt=""
          className={`absolute inset-0 m-auto max-h-full max-w-full object-contain transition-opacity duration-300 ${
            idx === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-3 right-4 bg-black/30 text-white text-xs px-2 py-1 rounded-full">
            {current + 1} / {total}
          </div>
        </>
      )}
    </div>
  );
}
