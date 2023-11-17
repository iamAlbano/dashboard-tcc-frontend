import { create } from "zustand";

import productsData from "@/utils/data/products.json";

type ProductState = {
  products: any[];
  setProducts: (products: any[]) => void;
  resume: any[];
  setResume: (stats: any[]) => void;
};

export const useProduct = create<ProductState>((set) => ({
  products: productsData,
  setProducts: (products) => set({ products }),
  resume: [],
  setResume: (resume) => set({ resume }),
}));
