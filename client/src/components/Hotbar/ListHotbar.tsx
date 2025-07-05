"use client";

import React from "react";
import HotbarCard from "./HotbarCard";
import { usePlayerStore } from "@/stores/playerStore";

function ListHotbar() {
  const isinventoryLoading = usePlayerStore(
    (state) => state.isinventoryLoading
  );
  const inventory = usePlayerStore((state) => state.inventory);
  const inventoryError = usePlayerStore((state) => state.inventoryError);

  return (
    <>
      {Array.from({ length: 10 }, (_, index) => {
        const item = inventory ? Object.entries(inventory)[index] : null;

        return (
          <HotbarCard
            key={index}
            item={item}
            isLoading={isinventoryLoading}
            hasError={!!inventoryError}
          />
        );
      })}
    </>
  );
}

export default ListHotbar;
