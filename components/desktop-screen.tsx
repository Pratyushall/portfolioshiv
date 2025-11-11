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
  bgImage?: string;
};

type DraggableFolder = Folder & {
  x: number;
  y: number;
  z?: number;
  page?: number;
};

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

  // workspace size (mobile can be wider than viewport)
  const [canvasW, setCanvasW] = useState<number>(0);
  const [canvasH, setCanvasH] = useState<number>(0);

  const draggingIdRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTouchRef = useRef(false);

  // Scatter into pages so ALL icons are reachable (mobile scroll)
  useEffect(() => {
    isTouchRef.current = isTouchDevice();

    const scatter = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 640;

      const margin = mobile ? 16 : 24;
      const stepX = mobile ? 84 : 128; // tighter grid on mobile
      const stepY = mobile ? 92 : 148;
      const cols = Math.max(2, Math.floor((w - margin * 2) / stepX));
      const rows = Math.max(3, Math.floor((h - margin * 2) / stepY));
      const capacity = Math.max(1, cols * rows);
      const pages = Math.max(1, Math.ceil(FOLDERS.length / capacity));

      let i = 0;
      const mapped: DraggableFolder[] = FOLDERS.map((f) => {
        const page = Math.floor(i / capacity);
        const localIndex = i % capacity;
        const col = localIndex % cols;
        const row = Math.floor(localIndex / cols);

        const jitterX = rand(-16, 16);
        const jitterY = rand(-14, 14);

        const x =
          page * (w - margin * 2) + // shift each page to the right
          margin +
          col * stepX +
          jitterX;

        const y = margin + row * stepY + jitterY;

        i++;
        return {
          ...f,
          x,
          y,
          page,
          z: rand(10, 40),
        };
      });

      setDeskFolders(mapped);

      // workspace size: allow horizontal paging on mobile, single page on desktop
      const workspaceW = mobile ? pages * (w - margin * 2) + margin * 2 : w;
      setCanvasW(workspaceW);
      setCanvasH(h);
    };

    scatter();
    const onR = () => scatter();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  // Mouse drag
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const id = draggingIdRef.current;
      if (!id || isTouchRef.current) return;
      setDeskFolders((prev) =>
        prev.map((folder) => {
          if (folder.id !== id) return folder;
          const nextX = e.clientX - offsetRef.current.x;
          const nextY = e.clientY - offsetRef.current.y;
          const clampedX = Math.min(Math.max(nextX, 0), canvasW - 80); // 80 ~ icon width
          const clampedY = Math.min(Math.max(nextY, 0), canvasH - 80);
          return { ...folder, x: clampedX, y: clampedY };
        })
      );
    };
    const up = () => (draggingIdRef.current = null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [canvasW, canvasH]);

  // Touch drag (doesn't block scrolling unless dragging an icon)
  useEffect(() => {
    const move = (e: TouchEvent) => {
      const id = draggingIdRef.current;
      if (!id) return;
      const t = e.touches[0];
      // prevent scroll while actively dragging an icon
      e.preventDefault();
      setDeskFolders((prev) =>
        prev.map((folder) => {
          if (folder.id !== id) return folder;
          const nextX = t.clientX - offsetRef.current.x;
          const nextY = t.clientY - offsetRef.current.y;
          const clampedX = Math.min(Math.max(nextX, 0), canvasW - 72);
          const clampedY = Math.min(Math.max(nextY, 0), canvasH - 72);
          return { ...folder, x: clampedX, y: clampedY };
        })
      );
    };
    const end = () => (draggingIdRef.current = null);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
    return () => {
      window.removeEventListener("touchmove", move as any);
      window.removeEventListener("touchend", end as any);
      window.removeEventListener("touchcancel", end as any);
    };
  }, [canvasW, canvasH]);

  const startDragging = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    id: string
  ) => {
    draggingIdRef.current = id;
    const folder = deskFolders.find((f) => f.id === id);
    if (!folder) return;

    if ("touches" in e) {
      const t = e.touches[0];
      // only block scroll if we are starting a drag on an icon
      e.preventDefault();
      offsetRef.current = { x: t.clientX - folder.x, y: t.clientY - folder.y };
    } else {
      offsetRef.current = {
        x: (e as React.MouseEvent).clientX - folder.x,
        y: (e as React.MouseEvent).clientY - folder.y,
      };
    }
  };

  return (
    <div className="relative h-full w-full select-none">
      {/* BG */}
      <NeatBackground config={neatConfig} />

      {/* Workspace: scrollable on mobile if it overflows */}
      <div className="absolute inset-0 overflow-auto sm:overflow-visible">
        <div
          className="relative"
          style={{ width: canvasW || "100%", height: canvasH || "100%" }}
        >
          {/* Icons */}
          {deskFolders.map((folder) => {
            const thumb = folder.icon ?? folder.images?.[0];
            const isSelected = selectedFolderId === folder.id;

            return (
              <div
                key={folder.id}
                className="absolute w-20 sm:w-28 md:w-32"
                style={{
                  top: folder.y,
                  left: folder.x,
                  zIndex: 20 + (folder.z ?? 0) + (isSelected ? 50 : 0),
                  WebkitTapHighlightColor: "transparent",
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
                onTouchStart={(e) => startDragging(e, folder.id)}
              >
                <div
                  className={[
                    "rounded-xl overflow-hidden border shadow-md transition cursor-move flex items-center justify-center backdrop-blur",
                    "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
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

                <p
                  className={[
                    "mt-1 pr-3 leading-tight drop-shadow",
                    "text-[10px] sm:text-[11px] md:text-[12px]",
                    "text-white/90",
                    "selection:bg-transparent selection:text-inherit",
                  ].join(" ")}
                >
                  {folder.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

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
