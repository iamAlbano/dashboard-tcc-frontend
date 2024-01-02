import { create } from "zustand";

import api from "@/server/api";

type ProductState = {
  products: any[];
  setProducts: (products: any[]) => void;
  resume: any[];
  setResume: (stats: any[]) => void;
  getMostSoldProducts: (
    store_id: string,
    query: string,
    startDate: string,
    endDate: string,
    periodGroup?: string
  ) => Promise<any>;
  getMostSoldCategories: (
    store_id: string,
    query: string,
    startDate: string,
    endDate: string,
    periodGroup?: string
  ) => Promise<any>;
};

export const useProduct = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  resume: [],
  setResume: (resume) => set({ resume }),
  getMostSoldProducts: (store_id, query, startDate, endDate, periodGroup) =>
    getMostSoldProducts(store_id, query, startDate, endDate, periodGroup),
  getMostSoldCategories: (store_id, query, startDate, endDate, periodGroup) =>
    getMostSoldCategories(store_id, query, startDate, endDate, periodGroup),
}));

const getMostSoldProducts = async (
  store_id: string,
  query: string,
  startDate: string,
  endDate: string,
  periodGroup?: string
): Promise<any> => {
  try {
    const { data } = await api.getMostSoldProducts(
      store_id,
      query,
      startDate,
      endDate,
      5,
      periodGroup
    );
    return data;
  } catch (error) {
    return error;
  }
};

const getMostSoldCategories = async (
  store_id: string,
  query: string,
  startDate: string,
  endDate: string,
  periodGroup?: string
): Promise<any> => {
  try {
    const res = await api.getMostSoldCategories(
      store_id,
      query,
      startDate,
      endDate,
      5,
      periodGroup
    );

    return res.data?.categories;
  } catch (error) {
    return error;
  }
};
