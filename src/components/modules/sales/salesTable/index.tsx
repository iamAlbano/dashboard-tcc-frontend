"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { useAccessibility } from "@/context/accessibility";
import { useSale } from "@/context/sale";
import { useStore } from "@/context/store";
import { useEffect, useState } from "react";
import Table from "./table";

import api from "@/server/api";

export default function SalesTableSection() {
  const { getDict } = useAccessibility();
  const dict = getDict();

  const { selectedStore } = useStore();
  const { sales, setSales } = useSale();

  const [totalSales, setTotalSales] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetSales(
    page?: number,
    startDate?: string | null,
    endDate?: string | null
  ) {
    if (!selectedStore?.id) return;

    setLoading(true);
    const { data } = await api.getSales(
      selectedStore?.id,
      page ?? 1,
      10,
      null,
      startDate,
      endDate
    );

    setSales(data?.sales ?? []);
    setTotalSales(data?.total_sales ?? 0);
    setLoading(false);
  }

  useEffect(() => {
    handleGetSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  return (
    <DataAccordion title="Visualizar Vendas" icon="pi pi-shopping-cart">
      <Table
        totalSales={totalSales}
        isLoading={loading}
        onFilterChange={(
          page: number,
          startDate?: string | null,
          endDate?: string | null
        ) => handleGetSales(page, startDate, endDate)}
      />
    </DataAccordion>
  );
}
