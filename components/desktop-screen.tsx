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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <MobileIOSDesktop
        folders={FOLDERS}
        activeWindow={activeWindow}
        onFolderClick={onFolderClick}
        onCloseWindow={onCloseWindow}
        onMinimizeWindow={onMinimizeWindow}
        minimizedWindows={minimizedWindows}
        onRestoreWindow={onRestoreWindow} // ✅ now declared below
        openWhatsapp={openWhatsapp}
        setOpenWhatsapp={setOpenWhatsapp}
        musicOpen={musicOpen}
        setMusicOpen={setMusicOpen}
        audioRef={audioRef}
        bgImage={bgImage}
      />
    );
  }

  return (
    <DesktopBig
      folders={FOLDERS}
      onFolderClick={onFolderClick}
      activeWindow={activeWindow}
      onCloseWindow={onCloseWindow}
      onMinimizeWindow={onMinimizeWindow}
      minimizedWindows={minimizedWindows}
      onRestoreWindow={onRestoreWindow}
      openWhatsapp={openWhatsapp}
      setOpenWhatsapp={setOpenWhatsapp}
      musicOpen={musicOpen}
      setMusicOpen={setMusicOpen}
      audioRef={audioRef}
      bgImage={bgImage}
    />
  );
}

/* ------------------------------------------------------------
   DESKTOP VERSION (draggable)
------------------------------------------------------------ */
function DesktopBig({
  folders,
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
  bgImage,
}: {
  folders: Folder[];
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
}) {
  const [deskFolders, setDeskFolders] = useState<DraggableFolder[]>(() =>
    folders.map((f) => ({
      ...f,
      x: f.x ?? 100,
      y: f.y ?? 100,
    }))
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const draggingIdRef = useRef<string | null>(null);
  const offsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const id = draggingIdRef.current;
      if (!id) return;

      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
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
      });
    };

    const handleMouseUp = () => {
      draggingIdRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (frame) cancelAnimationFrame(frame);
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(254,254,254,0.15)_0%,rgba(34,43,60,0.18)_100%)]" />

      {/* draggable icons */}
      {deskFolders.map((folder) => {
        const thumb = folder.icon ?? folder.images?.[0];
        const isSelected = selectedFolderId === folder.id;
        return (
          <div
            key={folder.id}
            className="absolute w-28 select-none"
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
                "w-14 h-14 rounded-xl overflow-hidden border shadow-md transition cursor-move flex items-center justify-center",
                isSelected
                  ? "bg-white/40 border-white/60 ring-2 ring-white/60"
                  : "bg-white/25 border-white/15 hover:scale-105",
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

      {/* desktop taskbar */}
      <Taskbar
        minimizedWindows={minimizedWindows}
        onRestoreWindow={onRestoreWindow}
        onOpenWhatsapp={() => setOpenWhatsapp(true)}
        onToggleMusic={() => setMusicOpen(!musicOpen)}
      />
    </div>
  );
}

/* ------------------------------------------------------------
   MOBILE – iOS STYLE
------------------------------------------------------------ */
function MobileIOSDesktop({
  folders,
  activeWindow,
  onFolderClick,
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
}: {
  folders: Folder[];
  activeWindow: string | null;
  onFolderClick: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  minimizedWindows: string[];
  onRestoreWindow: (id: string) => void; // ✅ added
  openWhatsapp: boolean;
  setOpenWhatsapp: (v: boolean) => void;
  musicOpen: boolean;
  setMusicOpen: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  bgImage?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-black/20" />

      {/* status bar */}
      <div className="absolute top-0 left-0 right-0 h-10 px-4 flex items-center justify-between text-white/95 text-xs z-30">
        <span className="font-semibold tracking-wide">9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-2.5 bg-white/90 rounded-xs" />
          <span className="w-3 h-2.5 bg-white/70 rounded-xs" />
          <span className="w-5 h-2.5 bg-white/90 rounded-md ml-1" />
        </div>
      </div>

      {/* apps grid */}
      <div className="relative z-10 pt-12 pb-24 px-4 grid grid-cols-4 gap-4">
        {folders.map((folder) => {
          const thumb = folder.icon ?? folder.images?.[0];
          return (
            <button
              key={folder.id}
              onClick={() => onFolderClick(folder.id)}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 shadow-sm overflow-hidden flex items-center justify-center">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={folder.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] text-white/60 px-1 text-center">
                    {folder.title.slice(0, 3)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/90 text-center leading-none line-clamp-2">
                {folder.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* glass dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[82%] h-14 bg-white/12 backdrop-blur-xl rounded-3xl border border-white/15 flex items-center justify-evenly z-20">
        <button
          onClick={() => setMusicOpen(!musicOpen)}
          className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center"
        >
          <div className="w-6 h-6 rounded-full bg-[#FF0000] flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[6px] border-y-transparent translate-x-px" />
          </div>
        </button>
        <button
          onClick={() => setOpenWhatsapp(true)}
          className="w-10 h-10 rounded-2xl bg-[#25D366] flex items-center justify-center text-white"
        >
          <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
            <path d="M16 3C9.4 3 4 8.1 4 14.4c0 2.7 1.1 5.1 3 7.1L5.5 27 10 25.6c1.8 1 3.8 1.5 6 1.5 6.6 0 12-5.1 12-11.4C28 8.1 22.6 3 16 3z" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-2xl bg-black/90 flex items-center justify-center">
          <span className="text-[#e50914] text-sm font-bold leading-none">
            N
          </span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center">
          <span className="text-sky-500 text-[9px] font-semibold leading-none">
            prime
          </span>
        </div>
      </div>

      {/* opened window as fullscreen iOS sheet */}
      {folders.map((folder, index) => {
        const isOpen =
          activeWindow === folder.id && !minimizedWindows.includes(folder.id);
        if (!isOpen) return null;
        return (
          <div
            key={folder.id}
            className="fixed inset-0 z-999 bg-black/45 flex items-center justify-center"
          >
            <div className="w-[96vw] h-[88vh] rounded-3xl overflow-hidden shadow-2xl">
              <WindowDialog
                folder={folder}
                zIndex={1000 + index}
                onClose={() => onCloseWindow(folder.id)}
                onMinimize={() => onMinimizeWindow(folder.id)}
              />
            </div>
          </div>
        );
      })}

      {/* whatsapp window */}
      {openWhatsapp && (
        <WhatsAppWindow
          onClose={() => setOpenWhatsapp(false)}
          onMinimize={() => setOpenWhatsapp(false)}
        />
      )}

      {/* music window */}
      {musicOpen && (
        <MusicPlayer onClose={() => setMusicOpen(false)} audioRef={audioRef} />
      )}

      {/* if you ALSO want minimized windows on mobile, you can show Taskbar here: */}
      {/* <Taskbar
        minimizedWindows={minimizedWindows}
        onRestoreWindow={onRestoreWindow}
        onOpenWhatsapp={() => setOpenWhatsapp(true)}
        onToggleMusic={() => setMusicOpen(!musicOpen)}
      /> */}
    </div>
  );
}
