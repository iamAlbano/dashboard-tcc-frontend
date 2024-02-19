"use client";

import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import { useImport } from "@/context/import";
import { useStore } from "@/context/store";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import Form from "@/components/import/form";

export default function ImportModal() {
  const router = useRouter();
  const { getDict } = useAccessibility();
  const {
    selectedModule,
    openedModal,
    closeImportModal,
    importFile,
    productsColumns,
    salesColumns,
  } = useImport();
  const { selectedStore } = useStore();

  const dict = getDict();

  const onSubmit = async () => {
    if (selectedModule === "products" && !productsColumns.name?.length)
      return notify(dict.import.missingNameColumn, "error");

    if (selectedModule === "sales" && !salesColumns.product?.length)
      return notify(dict.import.missingProductColumn, "error");

    if (!selectedStore?.id) return;

    const imported = await importFile(selectedStore?.id);

    if (!imported) {
      notify(
        "Houve um erro ao importar o arquivo, tente novamente mais tarde",
        "error"
      );

      return;
    }
  };

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
