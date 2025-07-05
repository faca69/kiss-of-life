"use client";

// import Terrain from "./terrain/Terrain";
import { Environment, Sky } from "@react-three/drei";
// import Tree from "./trees/Tree";
import { Physics } from "@react-three/rapier";
// import Player from "./player/Player";

function Scene() {
  return (
    <>
      <Physics debug>
        <Sky />
        <ambientLight intensity={0.25} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        {/* <Terrain position={[0, 0, 0]} /> */}
        {/* <Tree position={[0, 4, 0]} /> */}
        {/* <Tree position={[8, 4, 0]} /> */}
        {/* <Player position={[0, 2, 15]} /> */}
        <Environment preset="sunset" />
      </Physics>
    </>
  );
}

export default Scene;
