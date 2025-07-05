import { create, StateCreator } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface GameState {
  phase: "dead" | "playing" | "paused" | "menu";
  start: () => void;
  paused: () => void;
  dead: () => void;
}

const gameStore: StateCreator<
  GameState,
  [["zustand/subscribeWithSelector", never]],
  [],
  GameState
> = (set) => ({
  phase: "menu",

  start: () => {
    set((state) => {
      if (state.phase === "menu") return { phase: "playing" };
      return {};
    });
  },

  paused: () => {
    set((state) => {
      if (state.phase === "playing") return { phase: "paused" };
      return {};
    });
  },
  dead: () => {
    set((state) => {
      if (state.phase === "playing") return { phase: "dead" };
      return {};
    });
  },
});

export const useGameStore = create<GameState>()(
  subscribeWithSelector(gameStore)
);
