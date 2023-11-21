"use client";
import { useAccessibility } from "@/context/accessibility";
import { useStore } from "@/context/store";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useEffect } from "react";

export default function SelectStore() {
  const { getDict } = useAccessibility();
  const dict = getDict();
  const { selectedStore, stores, setSelectedStore, setOpenedCreateModal } =
    useStore();

  useEffect(() => {
    if (!stores.length) setSelectedStore(null);

    if (stores.length && !selectedStore) setSelectedStore(stores[0]);
  }, [stores, selectedStore, setSelectedStore]);

  const panelFooterTemplate = () => {
    return (
      <div className="p-2">
        <Button
          label={dict.store.newStore}
          icon="pi pi-plus-circle"
          iconPos="right"
          onClick={() => setOpenedCreateModal(true)}
          text
        />
      </div>
    );
  };

  return (
    <Dropdown
      value={selectedStore}
      onChange={(e: DropdownChangeEvent) => setSelectedStore(e.value)}
      options={stores}
      panelFooterTemplate={panelFooterTemplate}
      optionLabel="name"
      placeholder="Selecionar loja"
      className="w-5 border-none bg-transparent"
    />
  );
}
