"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import Scene from "@/components/Scene";
import { PointerLockControls } from "@react-three/drei";
import { InventoryModal } from "@/components/inventory/InventoryDIalog";
import Hotbar from "@/components/Hotbar/Hotbar";
import { useGameStore } from "@/stores/gameStore";
import { usePlayerStore } from "@/stores/playerStore";
import { Perf } from "r3f-perf";

export default function Game() {
  const phase = useGameStore((state) => state.phase);
  const isPlayerLoading = usePlayerStore((state) => state.isPlayerLoading);
  const isinventoryLoading = usePlayerStore(
    (state) => state.isinventoryLoading
  );
  const hasInitiallyLoaded = usePlayerStore(
    (state) => state.hasInitiallyLoaded
  );
  const { getPlayer, getinventory } = usePlayerStore();
  const [canvasReady, setCanvasReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === "playing") {
          getPlayer();
          getinventory();
        }
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "playing" && canvasReady && canvasRef.current) {
      const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
          });
          canvas.dispatchEvent(clickEvent);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [phase, canvasReady]);

  if (
    phase === "playing" &&
    (isPlayerLoading || (isinventoryLoading && !hasInitiallyLoaded))
  ) {
    return (
      <main className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading player data...</div>
      </main>
    );
  }

  if (phase !== "playing") {
    return <main className="w-full h-screen bg-black relative"></main>;
  }

  return (
    <main className="w-full h-screen bg-black relative">
      {phase === "playing" && <div className="dot" />}
      {canvasReady && <PointerLockControls />}

      <InventoryModal />
      <Hotbar />
      <Perf />
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [0, 20, 50], rotation: [0, 0, 0], fov: 75 }}
        onCreated={() => setCanvasReady(true)}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </main>
  );
}
