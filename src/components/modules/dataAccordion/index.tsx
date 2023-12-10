"use client";
import style from "./style.module.sass";

import { useAccessibility } from "@/context/accessibility";

type IProps = {
  title: string;
  icon: string;
  children: JSX.Element;
};

export default function DataAccordion({ ...props }: IProps) {
  const { theme } = useAccessibility();

  return (
    <section>
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
      <div className={style.accordion}>{props?.children}</div>
    </section>
  );
}
