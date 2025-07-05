"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function pickUpItemToInventory(inventory: Record<string, number>) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentPlayer = await prisma.player.findUnique({
      where: { id: userId },
    });

    if (!currentPlayer) {
      throw new Error("Player not found");
    }

    const currentInventory =
      (currentPlayer.inventory as Record<string, number>) || {};
    const updatedInventory = { ...currentInventory };

    Object.entries(inventory).forEach(([item, amount]) => {
      updatedInventory[item] = (updatedInventory[item] || 0) + amount;
    });

    const player = await prisma.player.update({
      where: { id: userId },
      data: { inventory: updatedInventory },
    });

    return player;
  } catch (error) {
    console.error("Error updating player inventory:", error);
    throw error;
  }
}
