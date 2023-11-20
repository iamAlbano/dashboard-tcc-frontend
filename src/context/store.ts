import { create } from "zustand";

type Store = {
  id?: string;
  name: string;
};

type StoreState = {
  stores: Store[];
  selectedStore?: Store;
  addStore: (store: Store) => void;
  setSelectedStore: (store: Store) => void;
  openedCreateModal: boolean;
  setOpenedCreateModal: (opened: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
  stores: [],
  selectedStore: undefined,
  addStore: (store: Store) => addStore(store),
  setSelectedStore: (store: Store) => set({ selectedStore: store }),
  openedCreateModal: false,
  setOpenedCreateModal: (opened: boolean) => set({ openedCreateModal: opened }),
}));

const addStore = (store: Store) => {
  const stores = useStore.getState().stores;
  stores.push(store);
  useStore.setState({ stores });
};
