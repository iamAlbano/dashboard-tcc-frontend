"use client";
import { useState } from "react";
import style from "./style.module.sass";

type ProductListProps = {
  products: {
    name: string;
    category: string;
    totalSold?: number;
    color: string;
  }[];
};

export default function ProductsList({ ...props }: ProductListProps) {
  const [table, setTable] = useState(props.products);

  return (
    <ul className={style.list} id="legend-container">
      {table.map((product, index) => (
        <li key={index}>
          <i
            style={{ color: product.color }}
            className={`pi pi-circle-fill ${style.dot}`}
          />
          <hr
            style={{ borderColor: product.color }}
            className={`${style.border}`}
          />

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
