import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-start)] via-[var(--color-bg-mid)] to-[var(--color-bg-end)] dark:from-[var(--color-bg-start-dark)] dark:via-[var(--color-bg-mid-dark)] dark:to-[var(--color-bg-end-dark)] flex flex-col transition-colors duration-500">
    <Header />
    <div className="flex flex-1 backdrop-blur-2xl bg-white/60 dark:bg-black/40 transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-10 space-y-6">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
