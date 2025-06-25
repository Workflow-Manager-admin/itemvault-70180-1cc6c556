"use client";

import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2800}
        hideProgressBar={true}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
        toastClassName="!rounded-lg !shadow-lg !border !border-primary/30 !bg-white !text-foreground"
        style={{ width: "auto", minWidth: 220, maxWidth: 420, marginTop: 16 }}
        limit={3}
      />
    </>
  );
}
