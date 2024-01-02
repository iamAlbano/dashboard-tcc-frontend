import { create } from "zustand";

import api from "@/server/api";

type CustomerState = {
  customers: any[];
  setCustomers: (customers: any[]) => void;
  getCustomers: (store_id: string, query: string) => Promise<any>;
  getCustomersStates: (store_id: string) => Promise<any>;
};

export const useCustomer = create<CustomerState>((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
  getCustomers: (store_id, query) => getCustomers(store_id, query),
  getCustomersStates: (store_id) => getCustomersStates(store_id),
}));

async function getCustomers(
  store_id: string,
  query: string,
  page = 1,
  limit = 10
) {
  try {
    const { data } = await api.getCustomers(store_id, page, limit, query);
    return data;
  } catch (error) {
    return error;
  }
}

async function getCustomersStates(store_id: string) {
  try {
    const { data } = await api.getCustomersStates(store_id);
    return data;
  } catch (error) {
    return error;
  }
}
