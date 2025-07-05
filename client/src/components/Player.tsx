"use client";

import { itemPickUp, grass1, grass2, grass3, grass4, grass5 } from "@/lib/sfx";
import { pickUpItemToInventory } from "@/actions/pickup.action";
import { usePlayerStore } from "@/stores/playerStore";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useSound } from "use-sound";

interface PlayerProps {
  position: [number, number, number];
}

const SPEED = 15;
const JUMP_FORCE = 5.7;

const velocity = new THREE.Vector3();
const forwardDirectionVector = new THREE.Vector3();
const sidewaysDirectionVector = new THREE.Vector3();

function Player({ position }: PlayerProps) {
  const [, getKeys] = useKeyboardControls();
  const [playPickup] = useSound(itemPickUp, { volume: 0.5 });
  const [playGrass1] = useSound(grass1, { volume: 0.3 });
  const [playGrass2] = useSound(grass2, { volume: 0.3 });
  const [playGrass3] = useSound(grass3, { volume: 0.3 });
  const [playGrass4] = useSound(grass4, { volume: 0.3 });
  const [playGrass5] = useSound(grass5, { volume: 0.3 });
  const { camera } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const updateInventory = usePlayerStore((state) => state.updateInventory);
  const [lastStepTime, setLastStepTime] = useState(0);

  const grassSoundPlayers = [
    playGrass1,
    playGrass2,
    playGrass3,
    playGrass4,
    playGrass5,
  ];

  const playRandomGrassSound = () => {
    const randomIndex = Math.floor(Math.random() * grassSoundPlayers.length);
    grassSoundPlayers[randomIndex]();
  };

  const handleWoodPickup = async () => {
    playPickup();
    try {
      await pickUpItemToInventory({ wood: 1 });
      updateInventory({ wood: 1 });
    } catch (error) {
      console.error("Failed to pick up wood:", error);
    }
  };

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward, jump } = getKeys();

    if (!rigidBodyRef.current) return;

    const pos = rigidBodyRef.current.translation();
    camera.position.copy(pos);
    camera.position.y += 0.65;

    forwardDirectionVector.set(0, 0, -+forward + +backward);
    sidewaysDirectionVector.set(+rightward - +leftward, 0, 0);

    velocity.addVectors(forwardDirectionVector, sidewaysDirectionVector);
    velocity.normalize();
    velocity.multiplyScalar(SPEED);
    velocity.multiplyScalar(delta * 20);
    velocity.applyEuler(camera.rotation);

    const currentVel = rigidBodyRef.current.linvel();
    const isGrounded = Math.abs(currentVel.y) < 0.05;

    let yVelocity = currentVel.y;
    if (jump && isGrounded) {
      yVelocity = JUMP_FORCE;
    }

    rigidBodyRef.current.setLinvel(
      {
        x: velocity.x,
        y: yVelocity,
        z: velocity.z,
      },
      true
    );

    if (forward || backward || leftward || rightward) {
      const currentTime = state.clock.elapsedTime;
      if (currentTime - lastStepTime > 0.4) {
        playRandomGrassSound();
        setLastStepTime(currentTime);
      }
    }
  });

  return (
    <RigidBody
      name="player"
      ref={rigidBodyRef}
      friction={0}
      restitution={0}
      position={position}
      enabledRotations={[false, false, false]}
      onCollisionEnter={async (payload) => {
        if (payload.colliderObject?.name === "collectableWood") {
          await handleWoodPickup();
        }
      }}
    >
      <mesh>
        <capsuleGeometry args={[0.5]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </RigidBody>
  );
}

export default Player;
