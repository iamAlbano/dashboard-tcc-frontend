"use client";
import { useStore } from "@/context/store";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

export default function SelectStore() {
  const { selectedStore, stores, setSelectedStore } = useStore();

  return (
    <Dropdown
      value={selectedStore}
      onChange={(e: DropdownChangeEvent) => setSelectedStore(e.value)}
      options={stores}
      placeholder="Selecionar loja"
      className="w-5 border-none bg-transparent"
    />
  );
}
