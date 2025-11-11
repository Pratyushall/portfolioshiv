"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { NeatGradient, type NeatConfig } from "@firecms/neat"; // 👈 NEW
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
  bgImage?: string; // kept for API compatibility (unused now)
};

type DraggableFolder = Folder & {
  x: number;
  y: number;
};

// 👇 Your requested NEAT config
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

// 👇 Tiny client-only canvas wrapper for NEAT
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
  bgImage = "/images/shivpranav.jpg", // not used anymore
}: DesktopScreenProps) {
  const [deskFolders, setDeskFolders] = useState<DraggableFolder[]>(() =>
    FOLDERS.map((f) => ({
      ...f,
      x: f.x ?? 100,
      y: f.y ?? 100,
    }))
  );

  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const draggingIdRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = draggingIdRef.current;
      if (!id) return;

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

    const handleMouseUp = () => {
      draggingIdRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startDragging = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    draggingIdRef.current = id;
    const folder = deskFolders.find((f) => f.id === id);
    if (!folder) return;
    offsetRef.current = { x: e.clientX - folder.x, y: e.clientY - folder.y };
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 🔥 NEAT 3D background (replaces blurred image) */}
      <NeatBackground config={neatConfig} />

      {/* desktop icons */}
      {deskFolders.map((folder) => {
        const thumb = folder.icon ?? folder.images?.[0];
        const isSelected = selectedFolderId === folder.id;
        return (
          <div
            key={folder.id}
            className="absolute w-32 select-none"
            style={{ top: folder.y, left: folder.x }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(folder.id);
            }}
            onMouseDown={(e) => startDragging(e, folder.id)}
            onDoubleClick={() => {
              setSelectedFolderId(folder.id);
              onFolderClick(folder.id);
            }}
          >
            <div
              className={[
                "w-24 h-24 rounded-lg overflow-hidden border-2 shadow-lg transition cursor-move flex items-center justify-center",
                isSelected
                  ? "bg-blue-600/80 border-blue-300 ring-4 ring-blue-400/60 scale-105"
                  : "bg-white/30 border-white/40 hover:bg-white/40 hover:scale-105",
              ].join(" ")}
            >
              {thumb ? (
                <img
                  src={thumb || "/placeholder.svg"}
                  alt={folder.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-300 text-sm text-slate-600 font-bold">
                  📁
                </div>
              )}
            </div>
            <div
              className={[
                "mt-2 px-2 py-1 text-center rounded transition-all",
                isSelected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-transparent text-white drop-shadow-lg",
              ].join(" ")}
            >
              <p
                className={[
                  "leading-tight font-bold text-sm tracking-wide",
                  isSelected ? "text-white" : "text-white",
                ].join(" ")}
              >
                {folder.title}
              </p>
            </div>
          </div>
        );
      })}

      {/* windows */}
      {deskFolders.map((folder, index) => {
        const isOpen =
          activeWindow === folder.id && !minimizedWindows.includes(folder.id);
        if (!isOpen) return null;
        return (
          <WindowDialog
            key={folder.id}
            folder={folder}
            zIndex={60 + index}
            onClose={() => onCloseWindow(folder.id)}
            onMinimize={() => onMinimizeWindow(folder.id)}
          />
        );
      })}

      {/* whatsapp */}
      {openWhatsapp && (
        <WhatsAppWindow
          onClose={() => setOpenWhatsapp(false)}
          onMinimize={() => setOpenWhatsapp(false)}
        />
      )}

      {/* music */}
      {musicOpen && (
        <MusicPlayer onClose={() => setMusicOpen(false)} audioRef={audioRef} />
      )}

      {/* taskbar */}
      <Taskbar
        minimizedWindows={minimizedWindows}
        onRestoreWindow={onRestoreWindow}
        onOpenWhatsapp={() => setOpenWhatsapp(true)}
        onToggleMusic={() => setMusicOpen(!musicOpen)}
        onStartClick={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
