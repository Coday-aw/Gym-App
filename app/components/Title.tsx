import React from "react";

type HeaderProps = {
  children: React.ReactNode;
  size: string;
  color?: string;
};

const Title = ({ children, size, color }: HeaderProps) => {
  const base = "font-bold tracking-tight";
  const colorClass = color ?? "text-slate-100";
  return <div className={`${base} ${size} ${colorClass}`}>{children}</div>;
};

export default Title;