"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useStore } from "@/context/store";
import { ProgressSpinner } from "primereact/progressspinner";
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

  async function getProducts(page?: number) {
    if (!selectedStore?.id) return;

    setLoading(true);
    const { data } = await api.getProducts(selectedStore?.id, page ?? 1, 10);
    setProducts(data?.products ?? []);
    setTotalProducts(data?.total_products ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    getProducts();
  }, [selectedStore]);

  return (
    <DataAccordion
      title={dict.productsDict.productsTable.title}
      icon="pi pi-box"
    >
      <>
        {loading && products?.length === 0 && (
          <div className="flex justify-center items-center">
            <ProgressSpinner />
          </div>
        )}
        {!loading && (
          <Table
            totalProducts={totalProducts}
            onPageChange={(page: number) => getProducts(page)}
          />
        )}
      </>
    </DataAccordion>
  );
}
