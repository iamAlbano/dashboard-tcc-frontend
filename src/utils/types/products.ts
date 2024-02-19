type ProductsDict = {
  cards: ProductCardsDict;
  soldProducts: SoldProductsDict;
  productsTable: ProductsTableDict;
  categoriesSection: CategoriesSectionDict;
  columns: {
    name: string;
    description: string;
    category: string;
    price: string;
    purchasePrice: string;
    stock: string;
  };
};

type ProductCardsDict = {
  products: string;
  categories: string;
  sold: string;
  average_price: string;
};

type SoldProductsDict = {
  title: string;
  description: string;
};

type ProductsTableDict = {
  title: string;
  description: string;
};

type CategoriesSectionDict = {
  title: string;
  description: string;
};
