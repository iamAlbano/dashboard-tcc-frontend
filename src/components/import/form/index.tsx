import Upload from "@/components/import/upload";
import { notify } from "@/components/utils/toast";
import { useAccessibility } from "@/context/accessibility";
import {
  CustomersColumnsType,
  ProductsColumnsType,
  SalesColumnsType,
  useImport,
} from "@/context/import";
import Papa from "papaparse";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import * as XLSX from "xlsx";

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
    customersColumns,
    setCustomersColumns,
    selectedModule,
    setSelectedModule,
    productsFile,
    salesFile,
    customersFile,
  } = useImport();

  const dict = getDict();

  const moduleColumns = {
    products: productsColumns,
    sales: salesColumns,
    customers: customersColumns,
  };

  const [columns, setColumns] = useState<
    ProductsColumnsType | SalesColumnsType | CustomersColumnsType
  >(selectedModule ? moduleColumns[selectedModule] : salesColumns);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsFile, salesFile, customersFile]);

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
        purchasePrice:
          productPurchasePriceColumns.find((col) =>
            fileColumns.includes(col)
          ) ?? null,
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
          saleProductColumns.find((col) => fileColumns.includes(col)) ?? null,
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

    if (selectedModule === "customers") {
      const columns = {
        name:
          customerNameColumns.find((col) => fileColumns.includes(col)) ?? null,
        email:
          customerEmailColumns.find((col) => fileColumns.includes(col)) ?? null,
        phone:
          customerPhoneColumns.find((col) => fileColumns.includes(col)) ?? null,
        birthday:
          customerBirthdayColumns.find((col) => fileColumns.includes(col)) ??
          null,
        address:
          customerAddressColumns.find((col) => fileColumns.includes(col)) ??
          null,
        city:
          customerCityColumns.find((col) => fileColumns.includes(col)) ??
          customerAddressColumns.find((col) => fileColumns.includes(col)) ??
          null,
        state:
          customerStateColumns.find((col) => fileColumns.includes(col)) ??
          customerAddressColumns.find((col) => fileColumns.includes(col)) ??
          null,
        country:
          customerCountryColumns.find((col) => fileColumns.includes(col)) ??
          customerAddressColumns.find((col) => fileColumns.includes(col)) ??
          null,
        zipCode:
          customerZipCodeColumns.find((col) => fileColumns.includes(col)) ??
          null,
      };

      setColumns(columns as CustomersColumnsType);
      setCustomersColumns(columns as CustomersColumnsType);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      case "customers":
        file = customersFile;
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
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        handleGetXlsxColumns(file);
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

  const handleGetXlsxColumns = async (file: File) => {
    if (!file) return;

    setLoading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!data || data.length === 0) {
        throw new Error("No data found in the file.");
      }

      // @ts-expect-error unknown type
      data = data.filter((row: string[]) => row.length > 2);

      let [headerRow, ...rows] = data;
      const cols = (headerRow as string[]).filter(
        (col: string) => typeof col === "string"
      );

      const transformedRows: any[] = [];

      for (let row of rows) {
        const newRow = (row as string[]).filter(
          (value: string) =>
            typeof value === "string" || typeof value === "number"
        );

        // verifica se a linha é uma linha de total adicionada pelo usuário
        const isTotalRow = newRow.some((value: string | number) => {
          return (
            typeof value === "string" && value.toLowerCase().includes("total")
          );
        });

        if (newRow.length === cols.length && !isTotalRow)
          transformedRows.push({
            ...newRow.reduce((acc: any, value: any, index: number) => {
              return { ...acc, [cols[index]]: value };
            }, {}),
          });
      }

      setFileColumns(cols);
      setFileRows(transformedRows);
    } catch (error) {
      setFileColumns([]);
      setFileRows([]);
      notify("Erro: Não foi possível ler o arquivo.", "error");
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
      case "customers":
        setCustomersColumns(newColumns as CustomersColumnsType);
        break;
    }
  };

  const getColumnName = (column: string) => {
    switch (selectedModule) {
      case "products":
        return dict.productsDict.columns[column as keyof ProductsColumnsType];
      case "sales":
        return dict.salesDict.columns[column as keyof SalesColumnsType];
      case "customers":
        return dict.customersDict.columns[column as keyof CustomersColumnsType];
    }
  };

  const isValidColumns = (column: string) => {
    const columnValue: string = columns[column as keyof typeof columns];

    if (column === "name" && selectedModule === "products")
      return columnValue?.length > 0;

    if (column === "product" && selectedModule === "sales")
      return columnValue?.length > 0;

    return true;
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
          <p className="my-0 py-0">
            Escolha quais colunas de sua planilha correspondem aos dados a
            seguir.
          </p>
          <span className="flex flex-row flex-wrap gap-2">
            {Object.keys(columns).map((column: any) => {
              return (
                <div className="flex flex-column gap-1" key={column}>
                  <label htmlFor={column}>{getColumnName(column)}</label>
                  <Dropdown
                    id={column}
                    options={fileColumns}
                    value={columns[column as keyof typeof columns]}
                    onChange={(e) => handleSetColumn(column, e.value)}
                    className={`${!isValidColumns(column) ? "p-invalid" : ""}`}
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
  "product_category_name",
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
  "Preço de Venda Unitário",
  "Preço de Venda Unitário:",
  "preço de venda unitário",
  "preço de venda unitário:",
  "Preço de venda unitário",
  "preço",
  "preço",
];

const productPurchasePriceColumns = [
  "Preço de compra",
  "Preço de compra:",
  "preço de compra",
  "preço de compra:",
  "Preço de Venda Unitário",
  "Preço de Venda Unitário:",
  "preço de venda unitário",
  "preço de venda unitário:",
  "preco_compra",
  "compra",
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
  "Quantidade Vendida",
  "Quantidade Vendida:",
  "quantidade vendida",
  "quantidade vendida:",
  "Quantidade vendida",
];

const saleProductColumns = [
  "product",
  "produto",
  "product_name",
  "nome_produto",
  "product_name",
  "nome_produto",
  "nome do produto",
  "product name",
  "nome do produto",
  "product name",
  "product_id",
  "id_produto",
  "Produto",
  "Produto Vendido",
  "Produto Vendido:",
  "produto vendido",
  "produto vendido:",
  "Produto vendido",
  "Produto vendido:",
];

const saleCustomerColumns = [
  "customer",
  "cliente",
  "customer_id",
  "client_id",
  "id_cliente",
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
  "seller_id",
  "id_vendedor",
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

const customerNameColumns = [
  "name",
  "nome",
  "customer_name",
  "nome_cliente",
  "customer_name",
  "nome_cliente",
  "nome do cliente",
  "customer name",
  "nome do cliente",
  "customer name",
  "client",
  "cliente",
  "client name",
  "comprador",
  "comprado por",
  "cliente:",
  "comprador:",
  "comprado por:",
  "nome do comprador",
  "nome do comprador:",
  "nome do cliente:",
];

const customerEmailColumns = [
  "email",
  "email",
  "customer_email",
  "email_cliente",
  "customer_email",
  "email_cliente",
  "email do cliente",
  "customer email",
  "email do cliente",
  "customer email",
  "email",
  "email",
  "email do cliente:",
];

const customerPhoneColumns = [
  "phone",
  "telefone",
  "customer_phone",
  "telefone_cliente",
  "customer_phone",
  "telefone_cliente",
  "telefone do cliente",
  "customer phone",
  "telefone do cliente",
  "customer phone",
  "telefone",
  "telefone",
  "telefone do cliente:",
  "contato",
  "contato do cliente",
  "contato do cliente:",
  "telefone do contato",
  "telefone do contato:",
  "telefone do comprador",
  "telefone do comprador:",
  "celular",
  "numero do celular",
  "numero do celular:",
  "numero do telefone",
  "numero do telefone:",
  "celular do cliente",
  "celular do cliente:",
  "celular do comprador",
  "celular do comprador:",
  "numero do celular do cliente",
  "numero do celular do cliente:",
  "numero do celular do comprador",
  "numero do celular do comprador:",
];

const customerBirthdayColumns = [
  "birthday",
  "aniversario",
  "customer_birthday",
  "aniversario_cliente",
  "customer_birthday",
  "aniversario_cliente",
  "aniversario do cliente",
  "customer birthday",
  "aniversario do cliente",
  "customer birthday",
  "aniversario",
  "aniversario",
  "aniversario do cliente:",
  "data de nascimento",
  "data de nascimento:",
  "data de aniversario",
  "data de aniversario:",
  "data de aniversário",
  "data de aniversário:",
  "data de nascimento do cliente",
  "data de nascimento do cliente:",
  "data de nascimento do comprador",
  "data de nascimento do comprador:",
  "data de aniversario do cliente",
  "data de aniversario do cliente:",
  "data de aniversario do comprador",
  "data de aniversario do comprador:",
  "data de aniversário do cliente",
  "data de aniversário do cliente:",
  "data de aniversário do comprador",
  "data de aniversário do comprador:",
];

const customerAddressColumns = [
  "address",
  "endereco",
  "endreço",
  "customer_address",
  "endereco_cliente",
  "customer_address",
  "endereco_cliente",
  "endereco do cliente",
  "customer address",
  "endereco do cliente",
  "customer address",
  "endereco",
  "endereco do cliente:",
  "endereco do comprador",
  "endereco do comprador:",
  "endereco do contato",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do cliente:",
  "endereco do comprador",
  "endereco do comprador:",
  "endereco do contato",
  "endereco do contato:",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
  "endereco do cliente",
  "endereco do comprador",
  "endereco do contato",
  "endereco do cliente:",
  "endereco do comprador:",
  "endereco do contato:",
];

const customerCityColumns = [
  "city",
  "cidade",
  "customer_city",
  "cidade_cliente",
  "customer_city",
  "cidade_cliente",
  "cidade do cliente",
  "customer city",
  "cidade do cliente",
  "customer city",
  "cidade",
  "cidade do cliente:",
  "cidade do comprador",
  "cidade do comprador:",
  "cidade do contato",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do cliente:",
  "cidade do comprador",
  "cidade do comprador:",
  "cidade do contato",
  "cidade do contato:",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do comprador",
  "cidade do contato",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do comprador",
  "cidade do contato",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do comprador",
  "cidade do contato",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do comprador",
  "cidade do contato",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
  "cidade do cliente",
  "cidade do comprador",
  "cidade do contato",
  "cidade do cliente:",
  "cidade do comprador:",
  "cidade do contato:",
];

const customerStateColumns = [
  "state",
  "estado",
  "customer_state",
  "estado_cliente",
  "customer_state",
  "estado_cliente",
  "estado do cliente",
  "customer state",
  "estado do cliente",
  "customer state",
  "estado",
  "estado do cliente:",
  "estado do comprador",
  "estado do comprador:",
  "estado do contato",
  "estado do contato:",
  "estado do cliente",
  "estado do cliente:",
  "estado do comprador",
  "estado do comprador:",
  "estado do contato",
  "estado do contato:",
  "estado do cliente:",
  "estado do comprador:",
  "estado do contato:",
  "estado do cliente",
  "estado do comprador",
  "estado do contato",
  "estado do cliente:",
  "estado do comprador:",
  "estado do contato:",
  "estado do cliente",
  "estado do comprador",
  "estado do contato",
  "estado do cliente:",
  "estado do comprador:",
  "estado do contato:",
  "estado do cliente",
  "estado do comprador",
  "estado do contato",
  "estado do cliente:",
  "estado do comprador:",
  "estado do contato:",
  "estado do cliente",
  "estado do comprador",
  "estado do contato",
  "estado do cliente:",
  "estado do comprador:",
  "estado do contato:",
];

const customerCountryColumns = [
  "country",
  "pais",
  "customer_country",
  "pais_cliente",
  "customer_country",
  "pais_cliente",
  "pais do cliente",
  "customer country",
  "pais do cliente",
  "customer country",
  "pais",
  "pais do cliente:",
  "pais do comprador",
  "pais do comprador:",
  "pais do contato",
  "pais do contato:",
  "pais do cliente",
  "pais do cliente:",
  "pais do comprador",
  "pais do comprador:",
  "pais do contato",
  "pais do contato:",
  "pais do cliente:",
  "pais do comprador:",
  "pais do contato:",
  "pais do cliente",
  "pais do comprador",
  "pais do contato",
  "pais do cliente:",
  "pais do comprador:",
  "pais do contato:",
  "pais do cliente",
  "pais do comprador",
  "pais do contato",
  "pais do cliente:",
  "pais do comprador:",
  "pais do contato:",
  "pais do cliente",
  "pais do comprador",
  "pais do contato",
  "pais do cliente:",
  "pais do comprador:",
  "pais do contato:",
];

const customerZipCodeColumns = [
  "zip_code",
  "cep",
  "customer_zip_code",
  "cep_cliente",
  "customer_zip_code",
  "cep_cliente",
  "cep do cliente",
  "customer zip code",
  "cep do cliente",
  "customer zip code",
  "cep",
  "cep do cliente:",
  "cep do comprador",
  "cep do comprador:",
  "cep do contato",
  "cep do contato:",
  "cep do cliente",
  "cep do cliente:",
  "cep do comprador",
  "cep do comprador:",
  "cep do contato",
  "cep do contato:",
  "cep do cliente:",
  "cep do comprador:",
  "cep do contato:",
  "cep do cliente",
  "cep do comprador",
  "cep do contato",
  "cep do cliente:",
  "cep do comprador:",
  "cep do contato:",
  "cep do cliente",
  "cep do comprador",
  "cep do contato",
  "cep do cliente:",
  "cep do comprador:",
  "cep do contato:",
  "cep do cliente",
  "cep do comprador",
  "cep do contato",
  "cep do cliente:",
  "cep do comprador:",
  "cep do contato:",
];
