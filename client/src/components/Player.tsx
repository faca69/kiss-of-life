"use client";

import { itemPickUp } from "@/lib/sfx";
import { pickUpItemToInventory } from "@/actions/pickup.action";
import { usePlayerStore } from "@/stores/playerStore";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, RapierRigidBody, useRapier } from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSound } from "use-sound";

interface PlayerProps {
  position: [number, number, number];
}

function Player({ position }: PlayerProps) {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [play] = useSound(itemPickUp, { volume: 0.5 });
  const { rapier, world } = useRapier();
  const body = useRef<RapierRigidBody>(null);
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

  useEffect(() => {
    const jump = () => {
      const origin = body.current?.translation();
      if (!origin) return;

      const rayOrigin = { x: origin.x, y: origin.y - 1.1, z: origin.z };
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(rayOrigin, direction);
      const hit = world.castRay(ray, 2.0, true);

      if (hit && hit.timeOfImpact < 0.15) {
        body.current?.applyImpulse({ x: 0, y: 12, z: 0 }, true);
      }
    };

    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      }
    );

    return () => {
      unsubscribeJump();
    };
  }, [rapier, world, subscribeKeys]);

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const impulseStrength = 20 * delta;

    const camera = state.camera;
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    right.crossVectors(camera.up, direction).normalize();

    if (forward) {
      impulse.x += direction.x * impulseStrength;
      impulse.z += direction.z * impulseStrength;
    }

    if (backward) {
      impulse.x -= direction.x * impulseStrength;
      impulse.z -= direction.z * impulseStrength;
    }

    if (rightward) {
      impulse.x += -right.x * impulseStrength;
      impulse.z += -right.z * impulseStrength;
    }

    if (leftward) {
      impulse.x += right.x * impulseStrength;
      impulse.z += right.z * impulseStrength;
    }

    if (body.current) {
      body.current.applyImpulse(impulse, true);
    }

    const bodyPosition = body.current?.translation();
    if (!bodyPosition) return;

    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 0.25;
    cameraPosition.y += 0.65;

    state.camera.position.copy(cameraPosition);
  });

  return (
    <>
      <RigidBody
        name="player"
        canSleep={false}
        colliders="cuboid"
        onCollisionEnter={async (payload) => {
          if (payload.colliderObject?.name === "collectableWood") {
            await handleWoodPickup();
          }
        }}
        restitution={0.2}
        friction={1}
        lockRotations={true}
        position={position}
        ref={body}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </>
  );
}

export default Player;
