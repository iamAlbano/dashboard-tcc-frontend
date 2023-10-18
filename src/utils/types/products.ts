type ProductsDict = {
  cards: ProductCardsDict,
  soldProducts: SoldProductsDict,
  productsTable: ProductsTableDict,
  categoriesSection: CategoriesSectionDict,
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

type ProductsTableDict = {
  title: string,
  description: string,
}

type CategoriesSectionDict = {
  title: string,
  description: string,
}