import React from "react";
import { usePlayerStore } from "@/stores/playerStore";

function ListInventory() {
  const inventory = usePlayerStore((state) => state.inventory);
  const isinventoryLoading = usePlayerStore(
    (state) => state.isinventoryLoading
  );
  const inventoryError = usePlayerStore((state) => state.inventoryError);

  if (isinventoryLoading) return <div>Loading...</div>;
  if (inventoryError) return <div>Error: {inventoryError}</div>;
  if (!inventory) return <div>No inventory data found</div>;

  return (
    <div>
      <p>Inventory: {JSON.stringify(inventory, null, 2)}</p>
    </div>
  );
}

export default ListInventory;
