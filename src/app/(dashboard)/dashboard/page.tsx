"use client";
import { useAccessibility } from "@/context/accessibility";
import { useImport } from "@/context/import";
import { useStore } from "@/context/store";
import { useUser } from "@/context/user";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";
import { ProgressSpinner } from "primereact/progressspinner";
import { Steps } from "primereact/steps";
import { useState } from "react";

const Panel = dynamic(() => import("@/components/container/panel"), {
  ssr: false,
});
const BreadCrumbs = dynamic(
  () => import("@/components/navigation/breadcrumbs"),
  { ssr: false }
);

export default function Home() {
  const [step, setStep] = useState(0);
  const { name, surname } = useUser();
  const { selectedStore, stores, setSelectedStore, setOpenedCreateModal } =
    useStore();

  const { isUploading } = useImport();
  const { theme, getDict } = useAccessibility();
  const { openImportModal } = useImport();

  const dict = getDict();

  const items: MenuItem[] = [
    {
      icon: "pi pi-home",
      label: "Loja",
      template: (item) => itemRenderer(item, 1),
    },
    {
      icon: "pi pi-file-excel",
      label: "Formato",
      template: (item) => itemRenderer(item, 2),
    },
    {
      icon: "pi pi-box",
      label: "Produtos",
      template: (item) => itemRenderer(item, 3),
    },
    {
      icon: "pi pi-users",
      label: "Clientes",
      template: (item) => itemRenderer(item, 4),
    },
    {
      icon: "pi pi-shopping-cart",
      label: "Vendas",
      template: (item) => itemRenderer(item, 5),
    },
  ];

  const itemRenderer = (item: MenuItem, itemIndex: number) => {
    const isActiveItem = step === itemIndex;
    const backgroundColor = isActiveItem
      ? "var(--primary-color)"
      : "var(--surface-b)";
    const textColor = isActiveItem
      ? "var(--surface-b)"
      : "var(--text-color-secondary)";

    return (
      <div className="flex flex-column justify-content-center align-items-center gap-2">
        <span
          className="inline-flex align-items-center justify-content-center align-items-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer"
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            marginTop: "-25px",
          }}
          onClick={() => setStep(itemIndex)}
        >
          <i className={`${item.icon} text-xl`} />
        </span>
        <p className="m-0 text-gray-700">{item.label}</p>
      </div>
    );
  };

  return (
    <section className="flex flex-column h-full w-full gap-1">
      <BreadCrumbs />
      <Panel>
        <h1 className="text-lg pt-2 m-0">
          Olá, {name} {surname}. Seja bem-vindo!
        </h1>
        <p>Para utilizar a dashboard, vamos importar seus dados.</p>
        <div className="flex flex-column w-full bg-purple-50 p-4 border-round border-dashed border-2 border-primary">
          {isUploading && (
            <div className="flex flex-row w-full justify-content-center align-items-center align-content-center">
              <ProgressSpinner
                className="m-0"
                style={{ width: "40px", height: "40px" }}
              />
              <p className="ml-4">
                Aguarde enquanto os dados são importados...
              </p>
            </div>
          )}
          {!isUploading && step === 0 && (
            <div className="flex flex-column w-full justify-content-center align-items-center align-content-center">
              <Button label="Começar" onClick={() => setStep(1)} />
            </div>
          )}
          {(!selectedStore || (!isUploading && step === 1)) && (
            <div className="flex flex-column w-full justify-content-center align-items-center align-content-center">
              <p>
                Para importar os dados, é preciso criar uma loja. Nela serão
                armazenados os dados das vendas.
              </p>
              <div className="flex flex-row gap-2 w-full justify-content-center align-items-center align-content-center">
                <Button
                  label="Criar loja"
                  icon="pi pi-plus-circle"
                  iconPos="right"
                  onClick={() => setOpenedCreateModal(true)}
                />
                {selectedStore && (
                  <Button
                    label="Utilizar loja atual"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={() => setStep(2)}
                    outlined
                  />
                )}
              </div>
            </div>
          )}
          {!isUploading && step === 2 && (
            <ChooseSheetType
              onSelectType={(type: "single" | "multiple") =>
                setStep(type === "multiple" ? 3 : 5)
              }
            />
          )}
          {!isUploading && step === 3 && (
            <OpenImportModal
              module="products"
              onSkip={() => setStep(3)}
              onOpenModal={() => setStep(4)}
            />
          )}
          {!isUploading && step === 4 && (
            <OpenImportModal
              module="customers"
              onSkip={() => setStep(4)}
              onOpenModal={() => setStep(5)}
            />
          )}
          {!isUploading && step === 5 && <OpenImportModal module="sales" />}
        </div>
        <div className="py-4">
          <Steps
            model={items}
            activeIndex={step}
            className="py-4"
            onSelect={(e) => setStep(e.index)}
            readOnly={isUploading || !selectedStore}
          />
        </div>
      </Panel>
    </section>
  );
}

const ChooseSheetType = ({
  onSelectType,
}: {
  onSelectType: (type: "single" | "multiple") => void;
}) => (
  <>
    <p className="mb-4">
      Escolha o tipo de armazenamento de dados que você possui.
    </p>
    <div className="mt-8 flex flex-row gap-8 align-items-center align-content-center w-full justify-content-center">
      <Button
        className="flex flex-column"
        text
        onClick={() => onSelectType("single")}
      >
        <i className="pi pi-file-excel text-6xl" />
        <p className="font-bold">Planilha única com vendas</p>
      </Button>
      <Button
        className="flex flex-column"
        text
        onClick={() => onSelectType("multiple")}
      >
        <div className="flex flex-column gap-2">
          <span className="flex flex-row gap-2">
            <i className="pi pi-file-excel text-4xl" />
            <i className="pi pi-file-excel text-4xl" />
          </span>
          <span className="flex flex-row gap-2">
            <i className="pi pi-file-excel text-4xl" />
            <i className="pi pi-file-excel text-4xl" />
          </span>
        </div>
        <p className="font-bold">
          Várias planilhas, uma para cada entidade <br />
          (Produto, Clientes e Vendas).
        </p>
      </Button>
    </div>
  </>
);

const OpenImportModal = ({
  module,
  onSkip,
  onOpenModal,
}: {
  onOpenModal?: () => void;
  module: "products" | "customers" | "sales";
  onSkip?: () => void;
}) => {
  const { isUploading } = useImport();
  const { theme, getDict } = useAccessibility();
  const { openImportModal } = useImport();

  const dict = getDict();

  return (
    <div className="flex flex-row w-full justify-content-center">
      <Button
        label={`${dict?.import?.title} ${dict?.modules[module]?.title}`}
        icon="pi pi-upload"
        severity="info"
        outlined={theme === "dark"}
        disabled={isUploading}
        loading={isUploading}
        onClick={() => {
          onOpenModal?.();
          openImportModal(module);
        }}
      />
      {onSkip && (
        <Button
          label="Pular importação"
          className="ml-4"
          outlined
          onClick={onSkip}
        />
      )}
    </div>
  );
};
