import api from "@/server/api";
import { clearToken, getToken, setToken } from "@/utils/functions/localStorage";
import { create } from "zustand";

type User = {
  id?: string;
  name: string;
  surname: string;
  email: string;
};

type UserState = {
  user_id?: string;
  name: string;
  surname: string;
  email: string;
  set: (key: string, value: string) => void;
  setUser: (user: User) => void;
  isAuth: () => boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  signup: (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => Promise<any>;
};

export const useUser = create<UserState>((set) => ({
  user_id: "",
  name: "",
  surname: "",
  email: "",
  set: (key, value) => set({ [key]: value }),
  setUser: (user) => setUser(user),
  isAuth: () => isAuth(),
  login: async (email, password) => await login(email, password),
  logout: () => logout(),
  signup: async (
    name: string,
    surname: string,
    email: string,
    password: string
  ) => createUser(name, surname, email, password),
}));

const isAuth = () => {
  const user = getLocalUser();
  const token = getToken();
  if (!token || !user) return false;

  useUser.setState({
    user_id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
  });
  return true;
};

const setUser = (user: User) => {
  const userData = {
    name: user.name,
    surname: user.surname,
    email: user.email,
  };
  useUser.setState({ user_id: user.id, ...userData });
  setLocalUser({ id: user.id, ...userData });
};

const setLocalUser = (user: User) => {
  if (typeof window !== "undefined")
    localStorage.setItem("user", JSON.stringify(user));
};

const getLocalUser = () => {
  if (typeof window !== "undefined")
    return JSON.parse(localStorage.getItem("user") || "{}");
  return {};
};

const clearLocalUser = () => {
  if (typeof window !== "undefined") localStorage.removeItem("user");
};

const createUser = async (
  name: string,
  surname: string,
  email: string,
  password: string
) => {
  try {
    const response = await api.register(name, surname, email, password);
    return response;
  } catch (error) {
    return error;
  }
};

const login = async (email: string, password: string) => {
  try {
    const response = await api.login(email, password);

    if (response.status === 200) {
      setUser(response.data?.user);
      setToken(response.data?.token);
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

const logout = () => {
  clearLocalUser();
  clearToken();
  useUser.setState({ user_id: "", name: "", surname: "", email: "" });
};
