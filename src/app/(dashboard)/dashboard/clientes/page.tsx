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
    <section className="flex flex-column h-full w-full gap-2">
      <BreadCrumbs />
      <Panel>
        <ModuleHeader module="customers" />

        <section className="flex flex-column">
          <InfoCards />
          <MostPopularPlaces />
          <CustomersTableSection />
        </section>
      </Panel>
    </section>
  );
}
