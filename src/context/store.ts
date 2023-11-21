import api from "@/server/api";
import { create } from "zustand";

type Store = {
  id?: string;
  name: string;
};

type StoreState = {
  stores: Store[];
  setStores: (stores: Store[]) => void;
  selectedStore: Store | null;
  addStore: (store: Store) => void;
  setSelectedStore: (store: Store | null) => void;
  openedCreateModal: boolean;
  setOpenedCreateModal: (opened: boolean) => void;
  getUserStores: (user_id: string) => Promise<any>;
  createStore: (name: string, users: string[]) => Promise<any>;
};

export const useStore = create<StoreState>((set) => ({
  stores: [],
  setStores: (stores: Store[]) => set({ stores }),
  selectedStore: null,
  addStore: (store: Store) => addStore(store),
  setSelectedStore: (store: Store | null) => set({ selectedStore: store }),
  openedCreateModal: false,
  setOpenedCreateModal: (opened: boolean) => set({ openedCreateModal: opened }),
  getUserStores: (user_id: string) => getUserStores(user_id),
  createStore: (name: string, users: string[]) => createStore(name, users),
}));

const addStore = (store: Store) => {
  const stores = useStore.getState().stores;
  stores.push(store);
  useStore.setState({ stores });
};

const getUserStores = async (user_id: string) => {
  try {
    const res = await api.getUserStores(user_id);
    return res;
  } catch (error) {
    return error;
  }
};

const createStore = async (name: string, users: string[]) => {
  try {
    const res = await api.createStore(name, users);
    console.log(res);
    return res;
  } catch (error) {
    return error;
  }
};
