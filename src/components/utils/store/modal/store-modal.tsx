"use client";
import { useStore } from "@/context/store";
import { Dialog } from "primereact/dialog";

export default function CreateStoreModal() {
  const { stores, setSelectedStore, openedCreateModal, setOpenedCreateModal } =
    useStore();

  return (
    <Dialog
      header="Header"
      visible={openedCreateModal}
      style={{ width: "50vw" }}
      onHide={() => setOpenedCreateModal(false)}
    >
      <p className="m-0">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </Dialog>
  );
}
