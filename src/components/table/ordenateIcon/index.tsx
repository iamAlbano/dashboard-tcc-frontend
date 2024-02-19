"use client";
import { useState } from "react";

export type Direction = "asc" | "desc";
type Type = "numeric" | "alpha" | "slash";

type IProps = {
  column: string;
  direction?: Direction;
  type?: Type;
  className?: string;
  onChange?: (column: string, direction: Direction | undefined) => void;
};

export default function OrdenateIcon({ ...props }: IProps) {
  const [type, setType] = useState<Type | undefined>(props.type);
  const [direction, setDirection] = useState<Direction | undefined>(
    props.direction
  );

  function getIcon() {
    if (!direction) return `pi-sort-alt`;

    switch (type) {
      case "numeric":
        return `pi-sort-numeric-${direction === "asc" ? "up" : "down"}`;
      case "alpha":
        return `pi-sort-alpha-${direction === "asc" ? "up" : "down"}`;
      case "slash":
        return `pi-sort-alt-slash`;
      default:
        return `pi-sort-amount-${direction === "asc" ? "up" : "down"}`;
    }
  }

  function changeDirection() {
    const newDirection =
      direction === "desc"
        ? undefined
        : direction === undefined
        ? "asc"
        : "desc";

    setDirection(newDirection);
    props.onChange?.(props.column, newDirection);
  }

  return (
    <i
      className={`pi ${getIcon()} cursor-pointer ${props.className}`}
      onClick={changeDirection}
    />
  );
}
