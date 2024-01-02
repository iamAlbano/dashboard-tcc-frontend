"use client";
import dynamic from "next/dynamic";
import { useDebounce } from "primereact/hooks";
import { useState } from "react";

import { useCustomer } from "@/context/customer";

const OrdenateIcon = dynamic(() => import("@/components/table/ordenateIcon"));

import { Pagination } from "@/components/table/pagination";
import { InputText } from "primereact/inputtext";

type Props = {
  totalCustomers?: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
};

export default function CustomersTable({
  totalCustomers,
  isLoading,
  onPageChange,
}: Props) {
  const { customers } = useCustomer();

  const [page, setPage] = useState<number>(1);
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [category, setCategory] = useState<string | null>(null);

  const [sortedColumn, setSortedColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"up" | "down" | "">("");

  const categories = [
    { label: "Alimentos", value: "Alimentos" },
    { label: "Bebidas", value: "Bebidas" },
    { label: "Limpeza", value: "Limpeza" },
    { label: "Higiene", value: "Higiene" },
    { label: "Outros", value: "Outros" },
  ];

  return (
    <section className="flex flex-column gap-2">
      <div className="flex flex-row py-2 gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Pesquisar clientes"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      </div>

      {customers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>
                Nome <OrdenateIcon column="name" />
              </th>
              <th>
                Email <OrdenateIcon column="email" />
              </th>
              <th className="text-center">
                Data de nascimento <OrdenateIcon column="birthday" />
              </th>
              <th className="text-center">
                Endereço <OrdenateIcon column="address" />
              </th>
              <th className="text-center">
                Cidade <OrdenateIcon column="city" />
              </th>
              <th className="text-center">
                Estado <OrdenateIcon column="state" />
              </th>
              <th className="text-center">
                CEP <OrdenateIcon column="cep" />
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer, index) => (
              <tr key={index}>
                <td>{customer.name ?? "-"}</td>
                <td>{customer.email ?? "-"}</td>
                <td className="text-center">{customer.birthday ?? "-"}</td>
                <td className="text-center">{customer.address ?? "-"}</td>
                <td className="text-center">{customer.city ?? "-"}</td>
                <td className="text-center">{customer.state ?? "-"}</td>
                <td className="text-center">{customer.cep ?? "-"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                Total de clientes cadastrados: <strong>{totalCustomers}</strong>
              </td>
              {/*             <td className="text-center">R$25,00</td>
            <td className="text-center">96</td>
            <td className="text-center">R$460,00</td> */}
            </tr>
          </tfoot>
        </table>
      ) : (
        <p className="text-center">
          Nenhum cliente cadastrado, faça a importação de seus dados para
          visualizar as informações.
        </p>
      )}
      <Pagination
        currentPage={page}
        disabled={isLoading}
        totalPages={totalCustomers ? Math.ceil(totalCustomers / 10) : 1}
        onPageChange={(newPage: number) => {
          setPage(newPage);
          onPageChange(newPage);
        }}
      />
    </section>
  );
}
