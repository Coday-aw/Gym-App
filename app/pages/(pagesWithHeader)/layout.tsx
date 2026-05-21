import React from "react";
import Header from "../../components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-4">
      <Header />
      <main className="flex-1 pb-8">{children}</main>
    </div>
  );
}

export default Layout;
