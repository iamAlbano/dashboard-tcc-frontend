"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { notify } from "@/components/utils/toast";
import { useCustomer } from "@/context/customer";
import { useStore } from "@/context/store";
import { useEffect, useState } from "react";
import Table from "./table";

import api from "@/server/api";

export default function CustomersTableSection() {
  const { selectedStore } = useStore();
  const { customers, setCustomers, getCustomers } = useCustomer();

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetCustomers(page?: number, search?: string) {
    if (!selectedStore?.id) return;

    setLoading(true);
    try {
      const { data } = await api.getCustomers(
        selectedStore?.id,
        page ?? 1,
        10,
        search
      );

      setCustomers(data?.customers ?? []);
      setTotalCustomers(data?.total_customers ?? 0);
    } catch (error) {
      notify("Erro ao buscar clientes", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGetCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore?.id]);

  return (
    <DataAccordion title={"Clientes"} icon="pi pi-users">
      <Table
        totalCustomers={totalCustomers}
        onFilterChange={(page: number, search?: string) => {
          console.log("search", search);
          handleGetCustomers(page, search);
        }}
        isLoading={loading}
      />
    </DataAccordion>
  );
}
