"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import { RigidBody } from "@react-three/rapier";

interface CollectableWoodProps {
  position: [number, number, number];
}

function CollectableWood({ position }: CollectableWoodProps) {
  const collectableWoodRef = useRef<Mesh>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 300000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <RigidBody
      name="collectableWood"
      onCollisionEnter={(payload) => {
        if (payload.colliderObject?.name === "player") {
          setIsVisible(false);
        }
      }}
    >
      <mesh
        ref={collectableWoodRef}
        castShadow
        receiveShadow
        position={position}
      >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="sienna" />
      </mesh>
    </RigidBody>
  );
}

export default CollectableWood;
