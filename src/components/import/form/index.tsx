import Upload from "@/components/import/upload";
import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import {
  ProductsColumnsType,
  SalesColumnsType,
  useImport,
} from "@/context/import";
import Papa from "papaparse";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";

import { Tooltip } from "primereact/tooltip";

import { useEffect, useState } from "react";
import style from "./style.module.sass";

export default function ImportModal() {
  const { getDict } = useAccessibility();
  const {
    openedModal,
    productsColumns,
    setProductsColumns,
    salesColumns,
    setSalesColumns,
    selectedModule,
    setSelectedModule,
    productsFile,
    salesFile,
  } = useImport();

  const dict = getDict();

  const [columns, setColumns] = useState<
    ProductsColumnsType | SalesColumnsType
  >(selectedModule === "products" ? productsColumns : salesColumns);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [fileRows, setFileRows] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!openedModal || !selectedModule) {
      setFileColumns([]);
      setFileRows([]);
    }
  }, [openedModal, selectedModule]);

  useEffect(() => {
    handleGetFileColumns();
  }, [productsFile, salesFile]);

  useEffect(() => {
    if (fileColumns.length === 0) return;

    if (selectedModule === "products") {
      const columns = {
        name:
          productNameColumns.find((col) => fileColumns.includes(col)) ?? null,
        description:
          productDescriptionColumns.find((col) => fileColumns.includes(col)) ??
          null,
        category:
          productCategoryColumns.find((col) => fileColumns.includes(col)) ??
          null,
        price:
          productPriceColumns.find((col) => fileColumns.includes(col)) ?? null,
        stock:
          productStockColumns.find((col) => fileColumns.includes(col)) ?? null,
      };

      setColumns(columns as ProductsColumnsType);
      setProductsColumns(columns as ProductsColumnsType);
      return;
    }

    if (selectedModule === "sales") {
      const columns = {
        product:
          productNameColumns.find((col) => fileColumns.includes(col)) ?? null,
        quantity:
          productStockColumns.find((col) => fileColumns.includes(col)) ?? null,
        price: productPriceColumns.find((col) => fileColumns.includes(col)),
        customer:
          saleCustomerColumns.find((col) => fileColumns.includes(col)) ?? null,
        seller:
          saleSellerColumns.find((col) => fileColumns.includes(col)) ?? null,
        status:
          saleStatusColumns.find((col) => fileColumns.includes(col)) ?? null,
        date: dateColumns.find((col) => fileColumns.includes(col)) ?? null,
      };

      setColumns(columns as SalesColumnsType);
      setSalesColumns(columns as SalesColumnsType);
      return;
    }
  }, [fileColumns]);

  const handleGetFileColumns = () => {
    let file = null;

    switch (selectedModule) {
      case "products":
        file = productsFile;
        break;
      case "sales":
        file = salesFile;
        break;
    }

    if (!file) {
      setFileColumns([]);
      setFileRows([]);
      return;
    }

    switch (file.type) {
      case "text/csv":
        handleGetCsvColumns(file);
        break;
    }
  };

  const handleGetCsvColumns = async (file: any) => {
    if (!file) return;
    setLoading(true);
    try {
      const parseResult: any = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            if (!result?.data[0]) {
              reject(new Error("No data found in the file."));
            } else {
              resolve(result);
            }
          },
        });
      });

      if (!parseResult || !parseResult?.data) {
        throw new Error("No data found in the file.");
      }

      const cols = Object.keys(parseResult.data[0]);
      setFileColumns(cols.filter((col) => typeof col === "string"));
      setFileRows(parseResult.data);
    } catch (error) {
      setFileColumns([]);
      setFileRows([]);
      notify(dict.errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex flex-row justy-content-center p-8">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="4"
        />
      </div>
    );
  }

  const handleSetColumn = (column: string, value: string) => {
    const newColumns = { ...columns, [column]: value };
    setColumns((prev) => newColumns);
    switch (selectedModule) {
      case "products":
        setProductsColumns(newColumns as ProductsColumnsType);
        break;
      case "sales":
        setSalesColumns(newColumns as SalesColumnsType);
        break;
    }
  };

  const getColumnName = (column: string) => {
    switch (selectedModule) {
      case "products":
        return dict.productsDict.columns[column as keyof ProductsColumnsType];
      case "sales":
        return dict.salesDict.columns[column as keyof SalesColumnsType];
    }
  };

  return (
    <section className="flex flex-column gap-3">
      {fileColumns.length > 0 && (
        <div className="flex flex-column gap-3">
          <span className="flex flex-row gap-2">
            <h4 className="m-0">{dict.import.columnsSelectTile}</h4>
            <i
              className="custom-target-icon pi pi-question-circle p-text-secondary"
              data-pr-tooltip={dict.import.columnsSelectTooltip}
              data-pr-position="right"
            />
            <Tooltip target=".custom-target-icon" />
          </span>
          <span className="flex flex-row flex-wrap gap-2">
            {Object.keys(columns).map((column) => {
              return (
                <div className="flex flex-column gap-1" key={column}>
                  <label htmlFor={column}>{getColumnName(column)}</label>
                  <Dropdown
                    id={column}
                    options={fileColumns}
                    value={columns[column as keyof typeof columns]}
                    onChange={(e) => handleSetColumn(column, e.value)}
                    className={`${
                      ((column === "name" &&
                        !columns[column as keyof typeof columns]?.length) ||
                        (column === "product" &&
                          !columns[column as keyof typeof columns]?.length)) &&
                      "border-red-500"
                    }`}
                    showClear
                  />
                </div>
              );
            })}
          </span>
        </div>
      )}
      {!fileColumns.length && !fileRows.length ? (
        <Upload />
      ) : (
        <div
          className={`overflow-y-auto border-1 border-gray-300 border-round p-3 
          ${style.tableContainer}`}
        >
          <table>
            <thead>
              <tr>
                {fileColumns.map((column) => {
                  return <th key={column}>{column}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {fileRows
                .filter((row, index) => index <= 50)
                .map((row, index) => {
                  return (
                    <tr key={index}>
                      {fileColumns.map((column) => {
                        return <td key={column}>{row[column]}</td>;
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
      {fileRows.length > 0 && (
        <span>
          {dict.import.totalRecords}: {fileRows.length}
        </span>
      )}
    </section>
  );
}

const productNameColumns = [
  "name",
  "nome",
  "product_name",
  "nome_produto",
  "produto",
  "product",
  "nome do produto",
  "product name",
  "nome do produto",
  "product name",
];
const productDescriptionColumns = [
  "description",
  "descricao",
  "product_description",
  "descricao_produto",
  "product_description",
  "descricao_produto",
  "descricao do produto",
  "product description",
  "descricao do produto",
  "product description",
  "descrição",
  "descriçao",
  "descrição do produto",
  "product description",
];
const productCategoryColumns = [
  "category",
  "categoria",
  "product_category",
  "categoria_produto",
  "product_category",
  "categoria_produto",
  "categoria do produto",
  "product category",
  "categoria do produto",
  "product category",
];
const productPriceColumns = [
  "price",
  "preco",
  "product_price",
  "preco_produto",
  "product_price",
  "preco_produto",
  "valor",
  "product_value",
  "valor_produto",
  "product_value",
  "valor_produto",
  "valor do produto",
];
const productStockColumns = [
  "stock",
  "estoque",
  "product_stock",
  "estoque_produto",
  "product_stock",
  "estoque_produto",
  "quantidade",
  "product_quantity",
  "quantidade_produto",
  "product_quantity",
  "quantidade_produto",
  "quantidade do produto",
];

const saleCustomerColumns = [
  "customer",
  "cliente",
  "customer_name",
  "nome_cliente",
  "customer_name",
  "nome_cliente",
  "nome do cliente",
  "customer name",
  "nome do cliente",
  "customer name",
];

const saleSellerColumns = [
  "seller",
  "vendedor",
  "seller_name",
  "nome_vendedor",
  "seller_name",
  "nome_vendedor",
  "nome do vendedor",
  "seller name",
  "nome do vendedor",
  "seller name",
];

const saleStatusColumns = [
  "status",
  "estado",
  "sale_status",
  "estado_venda",
  "sale_status",
  "estado_venda",
  "estado da venda",
  "sale status",
  "estado da venda",
  "sale status",
];

const dateColumns = [
  "date",
  "data",
  "sale_date",
  "data_venda",
  "sale_date",
  "data_venda",
  "data da venda",
  "sale date",
  "data da venda",
  "sale date",
];
