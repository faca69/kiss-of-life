"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import ListInventory from "@/components/Inventory/ListInventory";

export function InventoryModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const toggle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "i") {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", toggle);
    return () => window.removeEventListener("keydown", toggle);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Inventory</DialogTitle>
        <DialogDescription>Your collected items</DialogDescription>
        <ListInventory />
      </DialogContent>
    </Dialog>
  );
}
