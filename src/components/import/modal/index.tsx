"use client";

import { useAccessibility } from "@/context/accessibility";
import { useImport } from "@/context/import";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import Form from "@/components/import/form";

export default function ImportModal() {
  const { theme, getDict } = useAccessibility();
  const { selectedModule, openedModal, closeImportModal, importFile } =
    useImport();

  const dict = getDict();

  function onSubmit() {
    importFile();
  }

  const footerContent = (
    <div>
      <Button
        label={dict?.cancel}
        icon="pi pi-times"
        onClick={() => closeImportModal()}
        severity="danger"
        text
      />
      <Button
        label={dict?.import?.buttonLabel}
        icon="pi pi-upload"
        onClick={() => onSubmit()}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={`${dict?.import?.title} ${
        selectedModule ? dict.modules[selectedModule].title : ""
      }`}
      visible={openedModal}
      style={{ width: "95vw" }}
      onHide={() => closeImportModal()}
      footer={footerContent}
    >
      <Form />
    </Dialog>
  );
}
