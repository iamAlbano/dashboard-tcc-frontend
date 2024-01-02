import ModuleHeader from "@/components/modules/header";
import dynamic from "next/dynamic";

const Panel = dynamic(() => import("@/components/container/panel"), {
  ssr: false,
});
const BreadCrumbs = dynamic(
  () => import("@/components/navigation/breadcrumbs"),
  { ssr: false }
);

import InfoCards from "@/components/modules/products/infoCards";

const ProductsTable = dynamic(
  () => import("@/components/modules/products/productsTable"),
  { ssr: false }
);
const SoldProductsSection = dynamic(
  () => import("@/components/modules/products/mostSoldProducts"),
  { ssr: false }
);
const CategoriesSection = dynamic(
  () => import("@/components/modules/products/categories"),
  { ssr: false }
);

export default function Home() {
  return (
    <section className="flex flex-column h-full w-full gap-2">
      <BreadCrumbs />
      <Panel>
        <ModuleHeader module="products" />
        <section className="flex flex-column">
          <InfoCards />

          <SoldProductsSection />

          <ProductsTable />

          <CategoriesSection />
        </section>
      </Panel>
    </section>
  );
}
