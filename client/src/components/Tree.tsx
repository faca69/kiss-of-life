"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import CollectableWood from "./CollectableWood";
import { RigidBody } from "@react-three/rapier";
import { useSound } from "use-sound";
import { woodHit } from "@/lib/sfx";
import { Clone, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

interface TreeProps {
  position: [number, number, number];
}

const MAX_CLICK_DISTANCE = 5;

function Tree({ position }: TreeProps) {
  const tree = useGLTF("/models/tree.gltf");
  const MAX_HEALTH = 3;
  const treeRef = useRef<Mesh>(null);
  const { camera } = useThree();

  const [play] = useSound(woodHit, { volume: 0.5 });
  const [health, setHealth] = useState<number>(MAX_HEALTH);
  const [chopped, setChopped] = useState<boolean>(false);
  const [wood, setWood] = useState<boolean>(false);
  const [woodPositions, setWoodPositions] = useState<
    [number, number, number][]
  >([]);

  const handleHit = (event: React.MouseEvent) => {
    event.stopPropagation();

    const treePos = new Vector3(...position);
    if (camera.position.distanceTo(treePos) > MAX_CLICK_DISTANCE) {
      return;
    }

    play();
    setHealth((current) => {
      const newHealth = current - 1;

      if (newHealth === 0) {
        setChopped(true);
        setWood(true);

        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 2 + 1.5;
        const x = position[0] + Math.cos(angle) * radius;
        const z = position[2] + Math.sin(angle) * radius;
        const y = position[1] - 2.5;

        setWoodPositions((prev) => [...prev, [x, y, z]]);
      }

      return newHealth;
    });
  };

  useEffect(() => {
    if (chopped) {
      const timer = setTimeout(() => {
        setHealth(MAX_HEALTH);
        setChopped(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [chopped]);

  return (
    <>
      {!chopped && (
        <RigidBody type="fixed">
          <mesh
            ref={treeRef}
            castShadow
            receiveShadow
            position={position}
            onClick={handleHit}
          >
            <Clone
              castShadow
              receiveShadow
              object={tree.scene}
              scale={0.5}
              position={[0, -2.89, 0]}
            />
          </mesh>
        </RigidBody>
      )}

      {wood &&
        woodPositions.map((pos, i) => (
          <CollectableWood key={i} position={pos} />
        ))}
    </>
  );
}

export default Tree;

//  Preloads the 3D model into memory before it's used, avoiding loading delays.
useGLTF.preload("/models/tree.gltf");
