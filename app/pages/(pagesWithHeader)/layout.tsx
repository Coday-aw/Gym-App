import React from "react";
import BottomNav from "../../components/BottomNav";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4 py-4 relative">
      <main className="flex-1 pb-24">{children}</main>
      <BottomNav />
    </div>
  );
}

export default Layout;
