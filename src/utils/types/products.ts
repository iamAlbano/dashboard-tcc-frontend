type ProductsDict = {
  cards: ProductCardsDict,
  soldProducts: SoldProductsDict,
}

type ProductCardsDict = {
  products: string,
  categories: string,
  sold: string,
  review: string,
}

type SoldProductsDict = {
  title: string,
  description: string,
}