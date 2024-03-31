"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import { useEffect, useState } from "react";
import Table from "./table";

import api from "@/server/api";

export default function ProductsTableSection() {
  const { getDict } = useAccessibility();
  const dict = getDict();

  const { selectedStore } = useStore();
  const { products, setProducts } = useProduct();

  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function getProducts({
    page = 1,
    search = null,
    columnSort = null,
    direction = undefined,
    category = null,
  }: {
    page?: number;
    search?: string | null;
    columnSort?: string | null;
    direction?: "asc" | "desc" | undefined;
    category?: string[] | null;
  }) {
    if (!selectedStore?.id) return;

    setLoading(true);

    const { data } = await api.getProducts(
      selectedStore?.id,
      page,
      10,
      search,
      category,
      columnSort,
      direction
    );
    setProducts(data?.products ?? []);
    setTotalProducts(data?.total_products ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    getProducts({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  return (
    <DataAccordion
      title={dict.productsDict.productsTable.title}
      icon="pi pi-box"
    >
      <Table
        totalProducts={totalProducts}
        isLoading={loading}
        onChange={(
          page: number,
          search: string,
          columnSort: string,
          direction: "asc" | "desc" | undefined,
          category: string[] | null
        ) => getProducts({ page, search, columnSort, direction, category })}
      />
    </DataAccordion>
  );
}
