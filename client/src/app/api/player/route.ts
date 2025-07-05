import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const type = new URL(request.url).searchParams.get("type");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (type === "full") {
      const player = await prisma.player.findUnique({
        where: {
          id: userId,
        },
        omit: {
          inventory: true,
        },
      });

      if (!player) {
        return NextResponse.json(
          { error: "Player not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(player);
    }

    if (type === "inventory") {
      const player = await prisma.player.findUnique({
        where: {
          id: userId,
        },
        select: {
          inventory: true,
        },
      });

      if (!player) {
        return NextResponse.json(
          { error: "Player Inventory not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(player.inventory);
    }
  } catch (error) {
    console.error("Error fetching player:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
