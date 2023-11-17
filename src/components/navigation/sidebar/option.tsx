"use client";
import { useEffect, useState } from "react";

import { button } from "@/utils/types/button";

import { Button } from "primereact/button";

export default function Option(props: button) {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
  }, []);

  return (
    <>
      <Button
        label={screenWidth > 1023 ? props.label : ""}
        icon={props.icon ?? undefined}
        iconPos={props.iconPos ?? "left"}
        severity={props.severity}
        disabled={props.disabled}
        text={props.text}
        raised={props.raised}
        rounded={props.rounded}
        outlined={props.outlined}
        onClick={props.onClick}
        className={props.className ?? ""}
        size={screenWidth < 1023 ? "large" : props.size ?? undefined}
      />
      {props?.children && <>{props.children}</>}
    </>
  );
}
