"use client";
import CategoriesFilter from "@/components/utils/categoriesFilter";
import { useProduct } from "@/context/product";
import { tableColumnHasValue } from "@/utils/functions/helpers";
import { useDebounce } from "primereact/hooks";
import { useEffect, useState } from "react";

import { /*OrdenateIcon, */ Direction } from "@/components/table/ordenateIcon";

import { Pagination } from "@/components/table/pagination";
import { InputText } from "primereact/inputtext";

type Props = {
  totalProducts?: number;
  isLoading?: boolean;
  onChange: (
    page: number,
    search: string,
    columnSort: string,
    direction: Direction | undefined,
    category: string[] | null
  ) => void;
};

export default function ProductsTable({
  totalProducts,
  isLoading,
  onChange,
}: Props) {
  const { products, categories } = useProduct();

  const [page, setPage] = useState<number>(1);
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [selectedCategories, setCategories] = useState<string[]>([]);

  const [sortedColumn, setSortedColumn] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<Direction | undefined>(undefined);

  useEffect(() => {
    onChange(
      page,
      debouncedSearch,
      sortedColumn,
      sortOrder,
      selectedCategories
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    // Reset page to 1 when search or category changes
    if (page !== 1) setPage(1);
    else
      onChange(
        page,
        debouncedSearch,
        sortedColumn,
        sortOrder,
        selectedCategories
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, selectedCategories, sortedColumn, sortOrder]);

  return (
    <section className="flex flex-column gap-2">
      <div className="flex flex-row py-2 gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Pesquisar produtos"
            className="bg-white"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
        <CategoriesFilter
          className="max-w-20rem w-full"
          onChange={(selectedCategories) => setCategories(selectedCategories)}
        />
      </div>

      {products.length > 0 && (
        <table className={isLoading ? "opacity-50" : ""}>
          <thead>
            <tr>
              <th>Produto</th>

              {tableColumnHasValue("category", products) && <th>Categoria</th>}
              {tableColumnHasValue("price", products) && (
                <th className="text-center">Preço de venda</th>
              )}
              {tableColumnHasValue("purchase_price", products) && (
                <th className="text-center">Preço de compra</th>
              )}
              {tableColumnHasValue("total_sold", products) && (
                <th className="text-center">Total vendidos</th>
              )}
              {tableColumnHasValue("price", products) && (
                <th className="text-center">Valor total de vendas</th>
              )}
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                {tableColumnHasValue("category", products) && (
                  <td>{product.category}</td>
                )}
                {tableColumnHasValue("price", products) && (
                  <td className="text-center">
                    {isNaN(product.price) ? "" : `R$${product.price}`}
                  </td>
                )}
                {tableColumnHasValue("purchase_price", products) && (
                  <td className="text-center">
                    {isNaN(product.purchase_price)
                      ? ""
                      : `R$${product.purchase_price}`}
                  </td>
                )}
                {tableColumnHasValue("total_sold", products) && (
                  <td className="text-center">
                    {typeof product.total_sold === "number"
                      ? product.total_sold.toFixed(2)
                      : product?.total_sold}
                  </td>
                )}
                {tableColumnHasValue("price", products) && (
                  <td className="text-center">
                    {isNaN(product.price)
                      ? ""
                      : `R$${(product.price * product.total_sold)?.toFixed(2)}`}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                Total de produtos cadastrados: <strong>{totalProducts}</strong>
              </td>
              {/*             <td className="text-center">R$25,00</td>
            <td className="text-center">96</td>
            <td className="text-center">R$460,00</td> */}
            </tr>
          </tfoot>
        </table>
      )}
      {!isLoading && products.length === 0 && (
        <p className="text-center">
          Nenhum produto cadastrado, faça a importação de seus dados para
          visualizar as informações.
        </p>
      )}
      <Pagination
        currentPage={page}
        disabled={isLoading}
        totalPages={totalProducts ? Math.ceil(totalProducts / 10) : 1}
        onPageChange={(newPage: number) => {
          setPage(newPage);
        }}
      />
    </section>
  );
}
