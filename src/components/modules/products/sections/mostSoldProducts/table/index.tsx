'use client'
import style from './style.module.sass'
import { useState } from 'react'

import { useProduct } from '@/context/product'

import { Rating } from 'primereact/rating'

export default function ProductsList() {

  const { products } = useProduct()
  const [table, setTable] = useState(products.slice(0, 3))

  return (
    <ul className={style.list} id="legend-container">
      {
        table.map((product, index) => (
          <li key={index}>

            <i className={`pi pi-circle-fill ${style.dot} ${style[`order${index+1}`]}`} />
            <hr className={`${style.border} ${style[`order${index+1}`]}`}/>

            <section className={style.product}>
              <h3>
                {product.name}
              </h3>
              <div className={style.info}>
                <Rating value={product.rating} readOnly cancel={false} />

                <p>
                  <i className="pi pi-tag" />
                  <span>{product.category}</span>
                </p>

                <p>
                  <i className="pi pi-shopping-cart" />
                  <span>
                    Média de vendas no período: 
                    <strong>15</strong>
                  </span>
                </p>

              </div>

            </section>
            <span className={`
              ${style.percentage}
              ${20 > 0 ? 'text-green-700' : 'text-red-700'}
            `}>
              + 20%
            </span>
          </li>
        ))
      }
    </ul>
  )
}