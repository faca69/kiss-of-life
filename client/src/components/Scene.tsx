"use client";

import { Environment, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Terrain from "@/components/Terrain";
import Tree from "@/components/Tree";
import Player from "@/components/Player";

function Scene() {
  return (
    <>
      <Physics debug>
        <Sky />
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Terrain position={[0, 0, 0]} />
        <Tree position={[0, 4, 0]} />
        <Tree position={[8, 4, 0]} />
        <Tree position={[-8, 4, 9]} />
        <Player position={[0, 2, 15]} />
        <Environment preset="sunset" />
      </Physics>
    </>
  );
}

export default Scene;
