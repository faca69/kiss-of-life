"use client";

import { useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

function Terrain({ position }: { position: [number, number, number] }) {
  const grassColorMap = useTexture("/textures/grass.jpg");

  grassColorMap.wrapS = grassColorMap.wrapT = THREE.RepeatWrapping;
  grassColorMap.repeat.set(22, 22);

  return (
    <RigidBody type="fixed" friction={0.5} name="terrain">
      <mesh receiveShadow position={position}>
        <boxGeometry args={[100, 2, 100]} />
        <meshStandardMaterial map={grassColorMap} />
      </mesh>
    </RigidBody>
  );
}

export default Terrain;
