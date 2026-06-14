"use client";

import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setOpen((o) => !o)} />
      <Sidebar open={open} />
      <main className={`transition-[margin] duration-200 ${open ? "ml-60" : "ml-0"}`}>
        {children}
      </main>
    </>
  );
}
