import axios, { AxiosResponse } from "axios";
import { config } from "dotenv";

config();

import { getToken } from "../utils/functions/localStorage";

const fileRequest = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${getToken()}`,
  },
});

const request = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

fileRequest.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

const api = {
  async login(email: string, password: string): Promise<AxiosResponse> {
    return request
      .post("/auth/login", {
        email,
        password,
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async register(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Promise<AxiosResponse> {
    return request
      .post("/user/create", {
        name,
        surname,
        email,
        password,
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getUserStores(user_id: string): Promise<AxiosResponse> {
    return request.get(`/store/get?user_id=${user_id}`).catch((error) => {
      return error?.response;
    });
  },
  async createStore(name: string, users: string[]): Promise<AxiosResponse> {
    return request
      .post("/store/create", {
        name,
        users,
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getProducts(
    store_id: string,
    page: number,
    limit: number,
    search?: string | null,
    categories?: string[] | null,
    columnSort?: string | null,
    direction?: "asc" | "desc" | null
  ): Promise<AxiosResponse> {
    return request
      .get(`/product/get`, {
        params: {
          store_id: store_id,
          page: page,
          limit: limit,
          search: search,
          categories: categories,
          order_by: columnSort,
          order_direction: direction,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getProductsResume(store_id: string): Promise<AxiosResponse> {
    return request
      .get(`/product/resume?store_id=${store_id}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async getCustomers(
    store_id: string,
    page: number,
    limit: number,
    search?: string | null,
    category?: string | null,
    columnSort?: string | null,
    direction?: "asc" | "desc" | null
  ): Promise<AxiosResponse> {
    return request
      .get(`/customer/get`, {
        params: {
          store_id: store_id,
          page: page,
          limit: limit,
          search: search,
          category: category,
          order_by: columnSort,
          order_direction: direction,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getCustomersStates(store_id: string): Promise<AxiosResponse> {
    return request
      .get(`/customer/states?store_id=${store_id}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async getCustomersResume(store_id: string): Promise<AxiosResponse> {
    return request
      .get(`/customer/resume?store_id=${store_id}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async getMostSoldProducts(
    store_id: string,
    startDate = "2023-01-01",
    endDate = "2023-12-31",
    limit = 3,
    periodGroup = "month",
    product_ids?: string[],
    categories?: string[]
  ): Promise<AxiosResponse> {
    return request
      .get("/product/most_sold", {
        params: {
          store_id: store_id,
          start_date: startDate,
          end_date: endDate,
          limit: limit,
          period_group: periodGroup,
          product_ids: product_ids,
          categories: categories,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getMostSoldCategories(
    store_id: string,
    categories: string[] = [],
    startDate = "2023-01-01",
    endDate = "2023-12-31",
    limit = 5,
    periodGroup = "month"
  ): Promise<AxiosResponse> {
    return request
      .get("/product/most_sold_categories", {
        params: {
          store_id: store_id,
          categories: categories,
          start_date: startDate,
          end_date: endDate,
          limit: limit,
          period_group: periodGroup,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getCategories(store_id: string): Promise<AxiosResponse> {
    return request
      .get(`/product/categories?store_id=${store_id}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async getSalesResume(
    store_id: string,
    start_date = "2023-01-01",
    end_date = "2023-12-31"
  ): Promise<AxiosResponse> {
    return request
      .get(
        `/sale/resume?store_id=${store_id}&start_date=${start_date}&end_date=${end_date}`
      )
      .catch((error) => {
        return error?.response;
      });
  },
  async getSales(
    store_id: string,
    page: number,
    limit: number,
    search?: string | null
  ): Promise<AxiosResponse> {
    return request
      .get(
        `/sale/get?store_id=${store_id}&page=${page}&limit=${limit}&search=${search}`
      )
      .catch((error) => {
        return error?.response;
      });
  },
  async getSalesByPeriod(
    store_id: string,
    query = "",
    startDate = "2023-01-01",
    endDate = "2023-12-31",
    limit = 3,
    periodGroup = "month"
  ): Promise<AxiosResponse> {
    return request
      .get("/sale/get_by_period", {
        params: {
          store_id: store_id,
          query: query,
          start_date: startDate,
          end_date: endDate,
          limit: limit,
          period_group: periodGroup,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getTopProductsSoldTogether(
    store_id: string,
    startDate = "2023-01-01",
    endDate = "2023-12-31",
    limit = 3,
    periodGroup = "month"
  ): Promise<AxiosResponse> {
    return request
      .get("/sale/get_top_products_sold_together", {
        params: {
          store_id: store_id,
          start_date: startDate,
          end_date: endDate,
          limit: limit,
          period_group: periodGroup,
        },
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async getMostProfitableProducts(): Promise<AxiosResponse> {
    return request.get("/product/most_profitable").catch((error) => {
      return error?.response;
    });
  },
  async searchProducts(
    store_id: string,
    searchTerm: string
  ): Promise<AxiosResponse> {
    return request
      .get(`/product/search?store_id=${store_id}&name=${searchTerm}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async importProducts(
    products_file: File,
    store_id: string,
    name_column: string,
    description_column?: string | null,
    category_column?: string | null,
    price_column?: string | null,
    purchase_price_column?: string | null,
    stock_column?: string | null
  ): Promise<AxiosResponse> {
    return fileRequest
      .post("/import/products", {
        file: products_file,
        store_id,
        name_column,
        description_column,
        category_column,
        price_column,
        purchase_price_column,
        stock_column,
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async importCustomers(
    customers_file: File,
    store_id: string,
    name_column: string | null,
    email_column?: string | null,
    phone_column?: string | null,
    birthday_column?: string | null,
    address_column?: string | null,
    city_column?: string | null,
    state_column?: string | null,
    country_column?: string | null,
    zip_code_column?: string | null
  ): Promise<AxiosResponse> {
    return fileRequest
      .post("/import/customers", {
        file: customers_file,
        store_id,
        name_column,
        email_column,
        phone_column,
        birthday_column,
        address_column,
        city_column,
        state_column,
        country_column,
        zip_code_column,
      })
      .catch((error) => {
        return error?.response;
      });
  },
  async importSales(
    sales_file: File,
    store_id: string,
    product_column: string,
    products_file?: File | null,
    quantity_column?: string | null,
    price_column?: string | null,
    seller_column?: string | null,
    customer_column?: string | null,
    status_column?: string | null,
    date_column?: string | null
  ): Promise<AxiosResponse> {
    return fileRequest
      .post("/import/sales", {
        sales_file: sales_file,
        store_id,
        product_column,
        quantity_column,
        price_column,
        seller_column,
        customer_column,
        status_column,
        date_column,
      })
      .catch((error) => {
        return error?.response;
      });
  },
};

export default api;
