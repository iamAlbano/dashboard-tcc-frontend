export type Module = "products" | "sales" | "customers";

export type Period = "year" | "month" | "week" | "day";

export type Option = {
  label: string;
  value: string;
  onClick?: () => void;
};
