import ModuleHeader from "@/components/modules/header";

import Panel from "@/components/container/panel";
import BreadCrumbs from "@/components/navigation/breadcrumbs";

import InfoCards from "@/components/modules/products/infoCards";

import CategoriesSection from "@/components/modules/products/categories";
import SoldProductsSection from "@/components/modules/products/mostSoldProducts";
import ProductsTable from "@/components/modules/products/productsTable";

export default function Home() {
  return (
    <section className="flex flex-column h-full w-full gap-2 lg:p-2 xl:p-4">
      <BreadCrumbs />
      <Panel>
        <section className="flex flex-column lg:px-4 xl:px-6">
          <ModuleHeader module="products" />
          <InfoCards />

          <SoldProductsSection />

          <ProductsTable />

          <CategoriesSection />
        </section>
      </Panel>
    </section>
  );
}
