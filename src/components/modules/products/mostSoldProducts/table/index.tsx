"use client";
import { useState } from "react";
import style from "./style.module.sass";

type ProductListProps = {
  products: {
    name: string;
    category: string;
    totalSold?: number;
  }[];
};

export default function ProductsList({ ...props }: ProductListProps) {
  const [table, setTable] = useState(props.products.slice(0, 3));

  return (
    <ul className={style.list} id="legend-container">
      {table.map((product, index) => (
        <li key={index}>
          <i
            className={`pi pi-circle-fill ${style.dot} ${
              style[`order${index + 1}`]
            }`}
          />
          <hr className={`${style.border} ${style[`order${index + 1}`]}`} />

          <section className={style.product}>
            <h3>{product.name}</h3>
            <div className={style.info}>
              <p>
                <i className="pi pi-tag" />
                <span>{product.category}</span>
              </p>

              {product.totalSold && (
                <p>
                  <i className="pi pi-shopping-cart" />
                  <span>
                    Total vendido no período
                    <strong>{product?.totalSold?.toFixed(2)}</strong>
                  </span>
                </p>
              )}
            </div>
          </section>
        </li>
      ))}
    </ul>
  );
}
