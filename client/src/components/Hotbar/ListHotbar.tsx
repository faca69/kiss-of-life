"use client";

import React, { useEffect } from "react";
import HotbarCard from "./HotbarCard";
import { usePlayerStore } from "@/stores/playerStore";

function ListHotbar() {
  const isinventoryLoading = usePlayerStore(
    (state) => state.isinventoryLoading
  );
  const inventory = usePlayerStore((state) => state.inventory);
  const inventoryError = usePlayerStore((state) => state.inventoryError);
  const selectedHotbarSlot = usePlayerStore(
    (state) => state.selectedHotbarSlot
  );
  const setSelectedHotbarSlot = usePlayerStore(
    (state) => state.setSelectedHotbarSlot
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key >= "1" && event.key <= "9") {
        const slot = parseInt(event.key) - 1;
        setSelectedHotbarSlot(slot);
      } else if (event.key === "0") {
        setSelectedHotbarSlot(9);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedHotbarSlot]);

  return (
    <>
      {Array.from({ length: 10 }, (_, index) => {
        const item = inventory ? Object.entries(inventory)[index] : null;
        const displayNumber = index === 9 ? 0 : index + 1;

        return (
          <HotbarCard
            key={index}
            item={item}
            isLoading={isinventoryLoading}
            hasError={!!inventoryError}
            isSelected={selectedHotbarSlot === index}
            slotNumber={displayNumber}
          />
        );
      })}
    </>
  );
}

export default ListHotbar;
