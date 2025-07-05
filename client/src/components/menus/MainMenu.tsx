"use client";

import { useGameStore } from "@/stores/gameStore";
import { useEffect } from "react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Menu() {
  const phase = useGameStore((state) => state.phase);
  const start = useGameStore((state) => state.start);
  const { user } = useUser();

  useEffect(() => {
    console.log("Game phase changed to:", phase);
  }, [phase]);

  if (phase !== "menu") return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-md flex-col">
      <h1 className="text-[70px] font-bold text-green-500 text-shadow-lg mb-8 text-center">
        LURDACRAFT
      </h1>
      <div className="absolute top-4 left-4 flex justify-start items-center gap-4">
        <SignedIn>
          <div className="flex items-center justify-center text-center align-middle gap-5">
            <p className="text-white text-3xl text-shadow-lg">
              Logged in as: {user?.firstName}
            </p>
          </div>
        </SignedIn>
      </div>

      <div className="space-y-4 flex flex-col items-center gap-4">
        <Button onClick={start} className=" w-[500px] text-2xl">
          Start Game
        </Button>
        <Button className="w-[500px] text-2xl">Settings</Button>
        <SignedOut>
          <SignUpButton>
            <Button className="w-[500px] text-2xl">Sign Up</Button>
          </SignUpButton>
          <SignInButton>
            <Button className="w-[500px] text-2xl">Sign In</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <SignOutButton>
            <Button className="w-[500px] text-2xl">Sign Out</Button>
          </SignOutButton>
        </SignedIn>
      </div>
    </div>
  );
}
