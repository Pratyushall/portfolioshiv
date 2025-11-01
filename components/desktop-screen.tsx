"use client";

import React, { useEffect, useRef, useState } from "react";
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
};

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
  bgImage = "/images/shivpranav.jpg",
}: DesktopScreenProps) {
  const [deskFolders, setDeskFolders] = useState<DraggableFolder[]>(() =>
    FOLDERS.map((f) => ({
      ...f,
      x: f.x ?? 100,
      y: f.y ?? 100,
    }))
  );

  // 👇 new: track which folder is selected (single-click)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const draggingIdRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const id = draggingIdRef.current;
      if (!id) return;

      setDeskFolders((prev) =>
        prev.map((folder) => {
          if (folder.id !== id) return folder;
          return {
            ...folder,
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y,
          };
        })
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
    offsetRef.current = {
      x: e.clientX - folder.x,
      y: e.clientY - folder.y,
    };
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* bg */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(254,254,254,0.2)_0%,rgba(37,47,65,0.1)_55%,rgba(34,43,60,0.25)_100%)] backdrop-blur-sm" />

      {/* desktop icons */}
      {deskFolders.map((folder) => {
        const thumb = folder.icon ?? folder.images?.[0];
        const isSelected = selectedFolderId === folder.id;
        return (
          <div
            key={folder.id}
            className="absolute w-28 select-none"
            style={{ top: folder.y, left: folder.x }}
            // single click → select
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFolderId(folder.id);
            }}
            // drag
            onMouseDown={(e) => startDragging(e, folder.id)}
            // double click → open
            onDoubleClick={() => {
              setSelectedFolderId(folder.id);
              onFolderClick(folder.id);
            }}
          >
            {/* icon wrapper */}
            <div
              className={[
                "w-14 h-14 rounded-xl overflow-hidden border shadow-md transition cursor-move flex items-center justify-center backdrop-blur",
                isSelected
                  ? "bg-white/40 border-white/60 ring-2 ring-white/60"
                  : "bg-white/20 border-white/15 hover:scale-105",
              ].join(" ")}
            >
              {thumb ? (
                <img
                  src={thumb}
                  alt={folder.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-[9px] text-slate-500">
                  no img
                </div>
              )}
            </div>

            {/* label */}
            <p
              className={[
                "mt-1 leading-tight pr-3 wrap-break-word drop-shadow",
                isSelected
                  ? "text-white font-semibold"
                  : "text-white/90 font-medium",
                "text-[11px]",
              ].join(" ")}
            >
              {folder.title}
            </p>
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
      />
    </div>
  );
}
