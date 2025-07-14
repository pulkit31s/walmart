"use client";

import { ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "../ui/ScrollProgress";
import Cursor from "../effects/Cursor";

type LayoutProps = {
  children: ReactNode;
  userLogin?: string;
};

export default function Layout({
  children,
  userLogin = "vkhare2909",
}: LayoutProps) {
  useEffect(() => {
    const timer = setInterval(() => {}, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <ScrollProgress />

      <Header />
      <Cursor />

      <main className="min-h-screen pt-20">{children}</main>

      <Footer />
    </>
  );
}
