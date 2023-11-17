"use client";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { useEffect, useState } from "react";

import DataAccordion from "@/components/modules/dataAccordion";
import Table from "./table";

import api from "@/server/api";

export default function ProductsTableSection() {
  const { getDict } = useAccessibility();
  const dict = getDict();

  const { setProducts } = useProduct();

  const [loading, setLoading] = useState<boolean>(false);

  async function getProducts(page?: number) {
    setLoading(true);
    const { data } = await api.getProducts(page ?? 1, 10);
    setProducts(data?.products ?? []);
    setLoading(false);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <DataAccordion
      title={dict.productsDict.productsTable.title}
      icon="pi pi-box"
    >
      {loading ? (
        <section className="w-full flex justify-center">
          <i className="pi pi-spin pi-spinner" />
        </section>
      ) : (
        <Table onPageChange={(page: number) => getProducts(page)} />
      )}
    </DataAccordion>
  );
}
