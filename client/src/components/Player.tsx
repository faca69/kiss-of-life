"use client";

import { itemPickUp } from "@/lib/sfx";
import { pickUpItemToInventory } from "@/actions/pickup.action";
import { usePlayerStore } from "@/stores/playerStore";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import React, { useRef } from "react";
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
  const [play] = useSound(itemPickUp, { volume: 0.5 });
  const { camera } = useThree();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const updateInventory = usePlayerStore((state) => state.updateInventory);

  const handleWoodPickup = async () => {
    play();
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
