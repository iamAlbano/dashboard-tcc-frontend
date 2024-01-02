"use client";
import DataAccordion from "@/components/modules/dataAccordion";
import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import { useCustomer } from "@/context/customer";
import { useStore } from "@/context/store";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";
import Table from "./table";

import api from "@/server/api";

export default function CustomersTableSection() {
  const { getDict } = useAccessibility();
  const dict = getDict();

  const { selectedStore } = useStore();
  const { customers, setCustomers, getCustomers } = useCustomer();

  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleGetCustomers(page?: number) {
    if (!selectedStore?.id) return;

    setLoading(true);
    try {
      const { data } = await api.getCustomers(selectedStore?.id, page ?? 1, 10);

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
  }, [selectedStore]);

  return (
    <DataAccordion title={"Clientes"} icon="pi pi-users">
      <>
        {loading && customers?.length === 0 && (
          <div className="flex justify-center items-center">
            <ProgressSpinner />
          </div>
        )}
        {!loading && (
          <Table
            totalCustomers={totalCustomers}
            onPageChange={(page: number) => handleGetCustomers(page)}
          />
        )}
      </>
    </DataAccordion>
  );
}
