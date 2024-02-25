"use client";
import { useStore } from "@/context/store";
import api from "@/server/api";
import { Option } from "@/utils/types/globals";
import { useDebounce } from "primereact/hooks";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useEffect, useState } from "react";
type SearchProductsProps = {
  onChange?: (productIds: string[]) => void;
  className?: string;
  initialProducts?: Option[];
  disabled?: boolean;
  loading?: boolean;
};

export default function SearchProducts({
  onChange,
  disabled,
  className,
  initialProducts,
  loading,
}: SearchProductsProps) {
  const { selectedStore } = useStore();
  const [search, debouncedSearch, setSearch] = useDebounce("", 1000);
  const [selectedProducts, setSelectedProducts] = useState<string[] | null>(
    initialProducts ? initialProducts.map((p) => p.value) : null
  );
  const [options, setOptions] = useState<Option[]>(initialProducts || []);

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStore?.id || debouncedSearch.length < 3) return;
      setSearching(true);
      try {
        const { data } = await api.searchProducts(
          selectedStore?.id,
          debouncedSearch
        );

        if (data.products) {
          setOptions((prev) => {
            const oldOptions = prev;

            data.products.map((product: { name: string; id: string }) => {
              const option = {
                label: product.name,
                value: product.id,
              };

              if (!oldOptions.find((o) => o.value === option.value)) {
                oldOptions.push(option);
              }
            });
            return oldOptions;
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSearching(false);
      }
    };

    fetchProducts();
  }, [selectedStore, debouncedSearch]);

  return (
    <form
      onChange={(e) => {
        e.preventDefault();
        // @ts-expect-error - value existe no target
        setSearch(e.target?.value);
      }}
      className="card flex justify-content-center"
    >
      <MultiSelect
        value={selectedProducts}
        onChange={(e: MultiSelectChangeEvent) => {
          setSelectedProducts(e.value);
          onChange?.(e.value as string[]);
        }}
        options={options}
        optionLabel="label"
        placeholder="Produtos"
        className={className}
        showSelectAll={false}
        disabled={disabled}
        virtualScrollerOptions={{ itemSize: 40 }}
        emptyFilterMessage={
          searching ? "Buscando..." : "Nenhum produto encontrado"
        }
        filter
      />
    </form>
  );
}
