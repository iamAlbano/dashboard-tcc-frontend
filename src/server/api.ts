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
    page: number,
    limit: number,
    search?: string | null
  ): Promise<AxiosResponse> {
    return request
      .get(`/product/get?page=${page}&limit=${limit}&search=${search}`)
      .catch((error) => {
        return error?.response;
      });
  },
  async getProductsResume(): Promise<AxiosResponse> {
    return request.get("/product/resume").catch((error) => {
      return error?.response;
    });
  },
  async getMostSoldProducts(
    store_id: string,
    query = "",
    startDate = "2023-01-01",
    endDate = "2023-12-31",
    limit = 3,
    periodGroup = "month"
  ): Promise<AxiosResponse> {
    return request
      .get("/product/most_sold", {
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
  async importProducts(
    products_file: File,
    store_id: string,
    name_column: string,
    description_column?: string | null,
    category_column?: string | null,
    price_column?: string | null,
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
        stock_column,
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
