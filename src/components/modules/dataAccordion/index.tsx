"use client";
import style from "./style.module.sass";

import { useAccessibility } from "@/context/accessibility";

import { Accordion, AccordionTab } from "primereact/accordion";

type IProps = {
  title: string;
  icon: string;
  children: JSX.Element;
};

export default function DataAccordion({ ...props }: IProps) {
  const { theme } = useAccessibility();

  return (
    <Accordion activeIndex={0}>
      <AccordionTab
        className={style.accordion}
        headerClassName="w-full"
        header={
          <div
            className={`${style.header} ${
              theme === "dark" ? style.darkHeader : style.whiteHeader
            }`}
          >
            <span className="flex flex-row align-items-center gap-2">
              <i className={props?.icon} />
              <h3 className={`vertical-align-middle`}>{props?.title}</h3>
            </span>
          </div>
        }
      >
        {props?.children}
      </AccordionTab>
    </Accordion>
  );
}
