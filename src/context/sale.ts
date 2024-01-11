import { create } from "zustand";

import api from "@/server/api";

type SaleState = {
  sales: any[];
  setSales: (sales: any[]) => void;
  resume: any[];
  setResume: (stats: any[]) => void;
  getResume: (
    store_id: string,
    startDate: string,
    endDate: string
  ) => Promise<any>;
};

export const useSale = create<SaleState>((set) => ({
  sales: [],
  setSales: (sales) => set({ sales }),
  resume: [],
  setResume: (resume) => set({ resume }),
  getResume: (store_id, startDate, endDate) =>
    getResume(store_id, startDate, endDate),
}));

const getResume = async (
  store_id: string,
  startDate?: string,
  endDate?: string
): Promise<any> => {
  try {
    const { data } = await api.getSalesResume(store_id, startDate, endDate);
    return data;
  } catch (error) {
    return error;
  }
};
