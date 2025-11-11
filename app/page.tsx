"use client";

import { useRef, useState, useEffect } from "react";
import HeroScreen from "@/components/hero-screen";
import DesktopScreen from "@/components/desktop-screen";

export default function Page() {
  const [screen, setScreen] = useState<"hero" | "desktop">("hero");
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [openWhatsapp, setOpenWhatsapp] = useState(false);
  const [musicOpen, setMusicOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const goToDesktop = () => setScreen("desktop");

  const handleFolderClick = (id: string) => {
    setActiveWindow(id);
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
  };

  const handleCloseWindow = (id: string) => {
    if (activeWindow === id) setActiveWindow(null);
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
  };

  const handleMinimizeWindow = (id: string) => {
    setMinimizedWindows((prev) => [...new Set([...prev, id])]);
    if (activeWindow === id) setActiveWindow(null);
  };

  const handleRestoreWindow = (id: string) => {
    setMinimizedWindows((prev) => prev.filter((w) => w !== id));
    setActiveWindow(id);
  };

  useEffect(() => {
    if (screen === "desktop" && musicOpen && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [screen, musicOpen, audioRef]);

  return (
    <main className="h-screen w-screen overflow-hidden">
      {screen === "hero" ? (
        <HeroScreen
          suggestions={[
            "theatre shots",
            "green screen takes",
            "candid / just like that",
            "showreel",
          ]}
          onSuggestionClick={goToDesktop}
          onSearch={goToDesktop}
        />
      ) : (
        <DesktopScreen
          onFolderClick={handleFolderClick}
          activeWindow={activeWindow}
          onCloseWindow={handleCloseWindow}
          onMinimizeWindow={handleMinimizeWindow}
          minimizedWindows={minimizedWindows}
          onRestoreWindow={handleRestoreWindow}
          openWhatsapp={openWhatsapp}
          setOpenWhatsapp={setOpenWhatsapp}
          musicOpen={musicOpen}
          setMusicOpen={setMusicOpen}
          audioRef={audioRef}
          bgImage="/images/shivpranav.jpg"
        />
      )}
    </main>
  );
}
