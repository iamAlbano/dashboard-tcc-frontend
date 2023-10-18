import { create } from 'zustand'

import productsData from '@/utils/data/products.json'

type ProductState = {
  products: any[]
}

export const useProduct = create<ProductState>((set) => ({
  products: productsData,
}))