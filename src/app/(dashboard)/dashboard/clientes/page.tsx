import CustomersTableSection from "@/components/modules/customers/customersTable";
import ModuleHeader from "@/components/modules/header";
import dynamic from "next/dynamic";

import InfoCards from "@/components/modules/customers/infoCards";
const Panel = dynamic(() => import("@/components/container/panel"), {
  ssr: false,
});
const BreadCrumbs = dynamic(
  () => import("@/components/navigation/breadcrumbs"),
  { ssr: false }
);

import MostPopularPlaces from "@/components/modules/customers/mostPopularPlaces";

export default function Home() {
  return (
    <section className="flex flex-column h-full w-full gap-2 lg:p-2 xl:p-4">
      <BreadCrumbs />
      <Panel>
        <section className="flex flex-column lg:px-4 xl:px-6">
          <ModuleHeader module="customers" />

          <InfoCards />

          <MostPopularPlaces />

          <CustomersTableSection />
        </section>
      </Panel>
    </section>
  );
}
