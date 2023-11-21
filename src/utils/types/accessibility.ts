export type Theme = "light" | "dark";

export type Language = "en" | "pt";

export type Dict = {
  language: string;
  success: string;
  cancel: string;
  create: string;
  select: string;
  missingFields: string;
  errorMessage: string;
  auth: AuthDict;
  sidebar: SidebarDict;
  modules: {
    [key: string]: ModuleDict;
  };
  time: TimeDict;
  import: ImportDict;
  productsDict: ProductsDict;
  store: StoreDict;
};

type AuthDict = {
  login: string;
  signup: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  resetPassword: string;
  passwordLengthWarning: string;
  mismatchPassword: string;
  invalidEmail: string;
  invalidPassword: string;
  invalidCredentials: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  emailAlreadyRegistered: string;
};

type SidebarDict = {
  overview: string;
  products: string;
  sales: string;
  customers: string;
  import: string;
};

type ModuleDict = {
  title: string;
  description: string;
  icon: string;
  add: string;
  edit: string;
  delete: string;
  search: string;
  noData: string;
  deleteConfirmation: string;
};

type ImportDict = {
  title: string;
  description: string;
  uploadPlaceholder: string;
  selectModulePlaceholder: string;
  buttonLabel: string;
  totalRecords: string;
  columnsSelectTile: string;
  columnsSelectTooltip: string;
  missingNameColumn: string;
};

type TimeDict = {
  year: string;
  month: string;
  week: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
};

type StoreDict = {
  title: string;
  storeName: string;
  selectStore: string;
  newStore: string;
  noStoreMessage: string;
  createStoreMessage: string;
  createSuccessMessage: string;
};
