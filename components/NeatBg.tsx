"use client";

import { useEffect, useRef } from "react";
import { NeatGradient, type NeatConfig } from "@firecms/neat";

const backgroundConfig = {
  colors: [
    { color: "#151315", enabled: true },
    { color: "#151213", enabled: true },
    { color: "#400405", enabled: true },
    { color: "#868A8D", enabled: true },
    { color: "#192026", enabled: false },
  ],
  speed: 0.5,
  horizontalPressure: 2,
  verticalPressure: 2,
  waveFrequencyX: 5,
  waveFrequencyY: 5,
  waveAmplitude: 10,
  shadows: 10,
  highlights: 0,
  colorBrightness: 1.1,
  colorSaturation: 10,
  wireframe: false,
  colorBlending: 8,
  backgroundColor: "#010615",
  backgroundAlpha: 1,
  // the grain* props may not be in NeatConfig typings; casting keeps TS happy
  grainScale: 100,
  grainSparsity: 0,
  grainIntensity: 1,
  grainSpeed: 3,
  resolution: 1,
  yOffset: 0,
} as unknown as NeatConfig;

export default function NeatBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const neat = new NeatGradient({
      ...backgroundConfig,
      ref: canvasRef.current,
    });
    return () => neat.destroy();
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
