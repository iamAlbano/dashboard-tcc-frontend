export type Theme = "light"|"dark"

export type Language = "en"|"pt"

export type Dict = {
  language: string,
  success: string,
  cancel: string,
  sidebar: SidebarDict
  modules: {
    [key: string]: ModuleDict
  },
  time: TimeDict,
  import: ImportDict,
  productsDict: ProductsDict,
}

type SidebarDict = {
  overview: string
  products: string
  sales: string
  customers: string
  import: string
}

type ModuleDict = {
  title: string,
  description: string,
  icon: string,
  add: string,
  edit: string,
  delete: string,
  search: string,
  noData: string,
  deleteConfirmation: string,
}

type ImportDict = {
  title: string,
  description: string,
  uploadPlaceholder: string,
  selectModulePlaceholder: string,
  buttonLabel: string,
}

type TimeDict = {
  year: string,
  month: string,
  week: string,
  day: string,
  hour: string,
  minute: string,
  second: string,
}

