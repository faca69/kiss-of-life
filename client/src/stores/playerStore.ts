import { create } from "zustand";
import { Player } from "@/generated/prisma";
import axios from "axios";

interface PlayerState {
  player: Player | null;
  isPlayerLoading: boolean;
  playerError: string | null;
  getPlayer: () => Promise<Player | null>;
  inventory: Record<string, number> | null;
  isinventoryLoading: boolean;
  inventoryError: string | null;
  getinventory: () => Promise<Record<string, number> | null>;
  updateInventory: (items: Record<string, number>) => void;
  hasInitiallyLoaded: boolean;
}

const initialState: Omit<
  PlayerState,
  "getPlayer" | "getinventory" | "updateInventory"
> = {
  player: null,
  isPlayerLoading: false,
  playerError: null,
  inventory: null,
  isinventoryLoading: false,
  inventoryError: null,
  hasInitiallyLoaded: false,
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  ...initialState,

  getPlayer: async () => {
    const { isPlayerLoading } = get();

    if (isPlayerLoading) return null;

    set({ isPlayerLoading: true, playerError: null });

    try {
      const response = await axios.get("/api/player?type=full");
      const player = response.data;
      set({ player });
      return player;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch player data";
      set({ playerError: errorMessage });
      return null;
    } finally {
      set({ isPlayerLoading: false });
    }
  },

  getinventory: async () => {
    const { isinventoryLoading } = get();

    if (isinventoryLoading) return null;

    set({ isinventoryLoading: true, inventoryError: null });

    try {
      const response = await axios.get("/api/player?type=inventory");
      const inventory = response.data;
      set({ inventory, hasInitiallyLoaded: true });
      return inventory;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch inventory data";
      set({ inventoryError: errorMessage });
      return null;
    } finally {
      set({ isinventoryLoading: false });
    }
  },

  updateInventory: (items: Record<string, number>) => {
    const { inventory } = get();
    const currentInventory = inventory || {};
    const updatedInventory = { ...currentInventory };
    Object.entries(items).forEach(([item, amount]) => {
      updatedInventory[item] = (updatedInventory[item] || 0) + amount;
    });

    set({ inventory: updatedInventory });
  },
}));
