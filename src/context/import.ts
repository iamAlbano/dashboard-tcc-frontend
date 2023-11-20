import api from "@/server/api";
import { create } from "zustand";

import { Module } from "@/utils/types/globals";

export type ProductsColumnsType = {
  name: string | null;
  description: string | null;
  category: string | null;
  price: string | null;
  stock: string | null;
};

export type ImportState = {
  openedModal: boolean;
  selectedModule: Module | null;
  openImportModal: (module: Module | undefined) => void;
  closeImportModal: () => void;
  setSelectedModule: (module: Module | null) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  productsFile: File | null;
  salesFile: File | null;
  setFile: (type: string, file: File | null) => void;

  importFile: () => Promise<any>;

  productsColumns: ProductsColumnsType;
  setProductsColumns: (columns: ProductsColumnsType) => void;
};

export const useImport = create<ImportState>((set) => ({
  openedModal: false,
  selectedModule: null,
  openImportModal: (module: Module | undefined) => handleOpenModal(module),
  closeImportModal: () => handleCloseModal(),
  setSelectedModule: (module: Module | null) => set({ selectedModule: module }),
  isUploading: false,
  setIsUploading: (isUploading: boolean) => set({ isUploading: isUploading }),
  productsFile: null,
  salesFile: null,
  setFile: (type: string, file: File | null) => setFile(type, file),
  importFile: () => importFile(),

  productsColumns: {
    name: null,
    description: null,
    category: null,
    price: null,
    stock: null,
  },
  setProductsColumns: (columns: ProductsColumnsType) => {
    set({ productsColumns: columns });
  },
}));

function handleOpenModal(module: Module | undefined) {
  useImport.setState({ openedModal: true, selectedModule: module ?? null });
}

function handleCloseModal() {
  useImport.setState({
    openedModal: false,
    selectedModule: null,
    productsFile: null,
    salesFile: null,
  });
}

function setFile(type: string, file: File | null) {
  switch (type) {
    case "products":
      useImport.setState({ productsFile: file });
      break;
    case "sales":
      useImport.setState({ salesFile: file });
      break;
  }
}

async function importFile(): Promise<any> {
  const productsFile = useImport.getState().productsFile;
  const salesFile = useImport.getState().salesFile;

  handleCloseModal();
  await importProducts();
  await importSales();
}

async function importSales() {
  if (useImport.getState().isUploading) return;

  const salesFile = useImport.getState().salesFile;
  if (!salesFile) return;

  useImport.setState({ isUploading: true });
  await api.importSales(
    salesFile,
    "produto",
    null,
    "quantidade",
    "preco",
    null,
    null,
    "status",
    "data"
  );
  useImport.setState({ isUploading: false });

  useImport.setState({ salesFile: null });
}

async function importProducts() {
  if (useImport.getState().isUploading) return;

  const productsFile = useImport.getState().productsFile;
  if (!productsFile) return;

  const productsColumns = useImport.getState().productsColumns;
  if (!productsColumns.name?.length) return;

  useImport.setState({ isUploading: true });
  await api.importProducts(
    productsFile,
    productsColumns.name,
    productsColumns.description,
    productsColumns.category,
    productsColumns.price,
    productsColumns.stock
  );
  useImport.setState({ isUploading: false });

  useImport.setState({ productsFile: null });
}
