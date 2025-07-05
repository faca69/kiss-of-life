"use client";

import { RigidBody } from "@react-three/rapier";
import React from "react";

function Terrain({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" friction={0.5} name="terrain">
      <mesh receiveShadow position={position}>
        <boxGeometry args={[100, 2, 100]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </RigidBody>
  );
}

export default Terrain;
