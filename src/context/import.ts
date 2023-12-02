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

export type SalesColumnsType = {
  product: string | null;
  quantity: string | null;
  price: string | null;
  customer: string | null;
  seller: string | null;
  status: string | null;
  date: string | null;
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

  importFile: (store_id: string) => Promise<any>;

  productsColumns: ProductsColumnsType;
  setProductsColumns: (columns: ProductsColumnsType) => void;
  salesColumns: SalesColumnsType;
  setSalesColumns: (columns: SalesColumnsType) => void;
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
  importFile: (store_id: string) => importFile(store_id),

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

  salesColumns: {
    product: null,
    quantity: null,
    price: null,
    customer: null,
    seller: null,
    status: null,
    date: null,
  },

  setSalesColumns: (columns: SalesColumnsType) => {
    set({ salesColumns: columns });
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

async function importFile(store_id: string): Promise<any> {
  const productsFile = useImport.getState().productsFile;
  const salesFile = useImport.getState().salesFile;

  useImport.setState({ openedModal: false });
  await importProducts(store_id);
  await importSales(store_id);
  handleCloseModal();
}

async function importSales(store_id: string) {
  if (useImport.getState().isUploading) return;

  const salesFile = useImport.getState().salesFile;
  if (!salesFile) return;

  const salesColumns = useImport.getState().salesColumns;
  if (!salesColumns.product?.length) return;

  useImport.setState({ isUploading: true });
  await api.importSales(
    salesFile,
    store_id,
    salesColumns.product,
    null,
    salesColumns.quantity,
    salesColumns.price,
    salesColumns.customer,
    salesColumns.seller,
    salesColumns.status,
    salesColumns.date
  );
  useImport.setState({ isUploading: false });

  useImport.setState({ salesFile: null });
}

async function importProducts(store_id: string) {
  if (useImport.getState().isUploading) return;

  const productsFile = useImport.getState().productsFile;

  if (!productsFile) return;

  const productsColumns = useImport.getState().productsColumns;
  if (!productsColumns.name?.length) return;

  useImport.setState({ isUploading: true });
  await api.importProducts(
    productsFile,
    store_id,
    productsColumns.name,
    productsColumns.description,
    productsColumns.category,
    productsColumns.price,
    productsColumns.stock
  );
  useImport.setState({ isUploading: false });

  useImport.setState({ productsFile: null });
  useImport.setState({
    productsColumns: {
      name: null,
      description: null,
      category: null,
      price: null,
      stock: null,
    },
  });
}
