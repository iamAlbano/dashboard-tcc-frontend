"use client";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { useCustomer } from "@/context/customer";

import { Pagination } from "@/components/table/pagination";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

type Props = {
  totalCustomers?: number;
  isLoading?: boolean;
  onFilterChange: (page: number, search?: string) => void;
};

export default function CustomersTable({
  totalCustomers,
  isLoading,
  onFilterChange,
}: Props) {
  const { customers } = useCustomer();

  const [page, setPage] = useState<number>(1);
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);

  useEffect(() => {
    onFilterChange(1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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

      {isLoading && customers.length === 0 && (
        <div className="flex justify-center items-center">
          <ProgressSpinner
            className="m-0"
            style={{ width: "40px", height: "40px" }}
          />
        </div>
      )}

      {customers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th className="text-center">Data de nascimento</th>
              <th className="text-center">Endereço</th>
              <th className="text-center">Cidade</th>
              <th className="text-center">Estado</th>
              <th className="text-center">CEP</th>
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
          onFilterChange(newPage);
        }}
      />
    </section>
  );
}
