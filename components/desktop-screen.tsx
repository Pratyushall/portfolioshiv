"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { NeatGradient, type NeatConfig } from "@firecms/neat";
import { FOLDERS } from "@/lib/folders";
import type { Folder } from "@/lib/folders";
import WindowDialog from "@/components/window-dialog";
import WhatsAppWindow from "@/components/whatsapp-window";
import MusicPlayer from "@/components/music-player";
import Taskbar from "@/components/taskbar";

type DesktopScreenProps = {
  onFolderClick: (id: string) => void;
  activeWindow: string | null;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  minimizedWindows: string[];
  onRestoreWindow: (id: string) => void;
  openWhatsapp: boolean;
  setOpenWhatsapp: (v: boolean) => void;
  musicOpen: boolean;
  setMusicOpen: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  bgImage?: string; // not used now
};

type DraggableFolder = Folder & {
  x: number;
  y: number;
  z?: number;
};

// === NEAT config (unchanged) ===
const neatConfig: NeatConfig = {
  colors: [
    { color: "#09351D", enabled: true },
    { color: "#769E7A", enabled: true },
    { color: "#22710A", enabled: true },
    { color: "#E5E5E5", enabled: true },
    { color: "#31A235", enabled: false },
  ],
  speed: 3.5,
  horizontalPressure: 6,
  verticalPressure: 5,
  waveFrequencyX: 10,
  waveFrequencyY: 9,
  waveAmplitude: 1,
  shadows: 10,
  highlights: 0,
  colorBrightness: 0.75,
  colorSaturation: -2,
  wireframe: false,
  colorBlending: 10,
  backgroundColor: "#3B7D1E",
  backgroundAlpha: 1,
  grainScale: 2,
  grainSparsity: 0,
  grainIntensity: 0.2,
  grainSpeed: 0.8,
  resolution: 1.2,
  yOffset: 914,
};

// === NEAT background wrapper ===
function NeatBackground({ config }: { config: NeatConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    const controller = new NeatGradient({ ...config, ref: canvasRef.current });
    return () => controller.destroy();
  }, [config]);
  return (
    <div className="absolute inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

// helpers
const isTouchDevice = () =>
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

const rand = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min));

export default function DesktopScreen({
  onFolderClick,
  activeWindow,
  onCloseWindow,
  onMinimizeWindow,
  minimizedWindows,
  onRestoreWindow,
  openWhatsapp,
  setOpenWhatsapp,
  musicOpen,
  setMusicOpen,
  audioRef,
}: DesktopScreenProps) {
  const [deskFolders, setDeskFolders] = useState<DraggableFolder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const draggingIdRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTouchRef = useRef(false);

  // Scatter/messy positions on mount & on resize
  useEffect(() => {
    isTouchRef.current = isTouchDevice();

    const scatter = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const margin = 24;
      // smaller icons on mobile, so we can pack more
      const stepX = w < 640 ? 88 : 128;
      const stepY = w < 640 ? 98 : 148;

      const cols = Math.max(2, Math.floor((w - margin * 2) / stepX));
      const rows = Math.max(3, Math.floor((h - margin * 2) / stepY));

      let i = 0;
      const mapped: DraggableFolder[] = FOLDERS.map((f) => {
        const col = i % cols;
        const row = Math.floor(i / cols) % rows;
        // jitter each icon to look “messy”
        const jitterX = rand(-20, 20);
        const jitterY = rand(-16, 16);
        const x = margin + col * stepX + jitterX;
        const y = margin + row * stepY + jitterY;
        i++;
        return {
          ...f,
          x: f.x ?? x,
          y: f.y ?? y,
          z: rand(10, 40), // random z-index-ish layering (we’ll add to base)
        };
      });

      setDeskFolders(mapped);
    };

    scatter();
    const onR = () => scatter();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // Mouse drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = draggingIdRef.current;
      if (!id || isTouchRef.current) return;
      setDeskFolders((prev) =>
        prev.map((folder) =>
          folder.id !== id
            ? folder
            : {
                ...folder,
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
              }
        )
      );
    };
    const handleMouseUp = () => (draggingIdRef.current = null);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Touch drag
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      const id = draggingIdRef.current;
      if (!id) return;
      const t = e.touches[0];
      setDeskFolders((prev) =>
        prev.map((folder) =>
          folder.id !== id
            ? folder
            : {
                ...folder,
                x: t.clientX - offsetRef.current.x,
                y: t.clientY - offsetRef.current.y,
              }
        )
      );
    };
    const end = () => (draggingIdRef.current = null);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
    };
  }, []);

  const startDragging = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    id: string
  ) => {
    draggingIdRef.current = id;
    const folder = deskFolders.find((f) => f.id === id);
    if (!folder) return;

    if ("touches" in e) {
      const t = e.touches[0];
      offsetRef.current = { x: t.clientX - folder.x, y: t.clientY - folder.y };
    } else {
      offsetRef.current = {
        x: (e as React.MouseEvent).clientX - folder.x,
        y: (e as React.MouseEvent).clientY - folder.y,
      };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      {/* NEAT 3D background */}
      <NeatBackground config={neatConfig} />

      {/* Desktop icons */}
      {deskFolders.map((folder, idx) => {
        const thumb = folder.icon ?? folder.images?.[0];
        const isSelected = selectedFolderId === folder.id;

        // responsive sizes (smaller on mobile):
        // container: w-20 on mobile, w-28 on sm+, w-32 on md+
        // icon:     w-14 h-14 mobile, w-16 h-16 sm, w-20 h-20 md
        return (
          <div
            key={folder.id}
            className="absolute w-20 sm:w-28 md:w-32"
            style={{
              top: folder.y,
              left: folder.x,
              zIndex: 20 + (folder.z ?? 0) + (isSelected ? 50 : 0),
              WebkitTapHighlightColor: "transparent", // kill blue tap highlight
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(folder.id);
            }}
            onDoubleClick={() => {
              setSelectedFolderId(folder.id);
              onFolderClick(folder.id);
            }}
            onMouseDown={(e) => startDragging(e, folder.id)}
            onTouchStart={(e) => {
              e.preventDefault();
              startDragging(e, folder.id);
            }}
          >
            {/* icon wrapper */}
            <div
              className={[
                "rounded-xl overflow-hidden border shadow-md transition cursor-move flex items-center justify-center backdrop-blur",
                "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
                // Transparent selection: remove blue; add subtle glow + border
                isSelected
                  ? "bg-white/10 border-white/50 ring-2 ring-white/60 shadow-[0_0_22px_rgba(255,255,255,0.35)]"
                  : "bg-white/15 border-white/20 hover:bg-white/25 hover:scale-105",
              ].join(" ")}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={folder.title}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200/30 text-[11px] text-slate-200">
                  📁
                </div>
              )}
            </div>

            {/* label (no selection background; keep transparent) */}
            <p
              className={[
                "mt-1 pr-3 leading-tight drop-shadow",
                "text-[10px] sm:text-[11px] md:text-[12px]",
                "text-white/90",
                "selection:bg-transparent selection:text-inherit", // transparent text selection
              ].join(" ")}
            >
              {folder.title}
            </p>
          </div>
        );
      })}

      {/* Windows */}
      {deskFolders.map((folder, index) => {
        const isOpen =
          activeWindow === folder.id && !minimizedWindows.includes(folder.id);
        if (!isOpen) return null;
        return (
          <WindowDialog
            key={folder.id}
            folder={folder}
            zIndex={200 + index}
            onClose={() => onCloseWindow(folder.id)}
            onMinimize={() => onMinimizeWindow(folder.id)}
          />
        );
      })}

      {/* WhatsApp */}
      {openWhatsapp && (
        <WhatsAppWindow
          onClose={() => setOpenWhatsapp(false)}
          onMinimize={() => setOpenWhatsapp(false)}
        />
      )}

      {/* Music */}
      {musicOpen && (
        <MusicPlayer onClose={() => setMusicOpen(false)} audioRef={audioRef} />
      )}

      {/* Taskbar */}
      <Taskbar
        minimizedWindows={minimizedWindows}
        onRestoreWindow={onRestoreWindow}
        onOpenWhatsapp={() => setOpenWhatsapp(true)}
        onToggleMusic={() => setMusicOpen(!musicOpen)}
        onStartClick={() => {}}
      />
    </div>
  );
}
