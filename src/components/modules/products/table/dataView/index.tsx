'use client'
import React, { useState, useEffect } from "react"

import ProductList from "../products.json"

import { Button } from "primereact/button"
import { DataView } from "primereact/dataview"
import { Rating } from "primereact/rating"
import { Tag } from "primereact/tag"

interface Product {
  id: string
  code: string
  name: string
  description: string
  image: string
  price: number
  category: string
  quantity: number
  inventoryStatus: string
  rating: number
}

export default function PaginationDemo() {
  const [products, setProducts] = useState<Product[]>(ProductList)

  const getSeverity = (product: Product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success"

      case "LOWSTOCK":
        return "warning"

      case "OUTOFSTOCK":
        return "danger"

      default:
        return null
    }
  }

  const itemTemplate = (product: Product) => {
    return (
      <section className="col-12 overflow-auto">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-2">
          <img
            className="w-9 sm:w-16rem xl:w-7rem shadow-2 block xl:block mx-auto border-round"
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-xl font-bold text-900">{product.name}</div>
              <Rating value={product.rating} readOnly cancel={false}></Rating>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <i className="pi pi-tag"></i>
                  <span className="font-semibold">{product.category}</span>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold">${product.price}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <DataView
      value={products}
      itemTemplate={itemTemplate}
      style={{ background: "transparent" }}
      paginator
      rows={4}
    />
  )
}
