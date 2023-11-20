"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { useAccessibility } from "@/context/accessibility";
import { useProduct } from "@/context/product";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import Table from "./table";

import api from "@/server/api";

export default function ProductsTableSection() {
  const { getDict } = useAccessibility();
  const dict = getDict();

  const { products, setProducts } = useProduct();

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
      <>
        {loading && (
          <div className="flex justify-center items-center">
            <ProgressSpinner />
          </div>
        )}
        {!loading && products.length > 0 && (
          <Table onPageChange={(page: number) => getProducts(page)} />
        )}
        {!loading && !products.length && (
          <p className="text-center">
            Nenhum produto cadastrado, faça a importação de seus dados para
            visualizar as informações.
          </p>
        )}
      </>
    </DataAccordion>
  );
}
