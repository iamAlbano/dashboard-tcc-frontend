"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (message: string, type?: "success" | "error") => {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: type ?? "success",
    theme: "dark",
  });
};

function NotifyContainer() {
  return <ToastContainer />;
}

export { NotifyContainer, notify };
