import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  width?: string;
  px?: string;
  py?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const Button = ({
  children,
  width,
  px = "4",
  py = "2",
  onClick,
  type,
  disabled,
  variant = "primary",
}: ButtonProps) => {
  const widthClass = width ? `w-${width}` : "w-auto";
  const paddingX = px ? `px-${px}` : "px-4";
  const paddingY = py ? `py-${py}` : "py-2";

  const variantClasses: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30",
    secondary:
      "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600",
    danger:
      "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-400 hover:to-pink-400 shadow-lg shadow-rose-500/20",
    ghost:
      "bg-transparent text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700",
  };

  const classes = [
    "rounded-xl",
    "inline-flex",
    "items-center",
    "justify-center",
    "font-semibold",
    "text-sm",
    "tracking-wide",
    "transition-all",
    "duration-200",
    "cursor-pointer",
    "active:scale-95",
    widthClass,
    paddingX,
    paddingY,
    variantClasses[variant] || variantClasses.primary,
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
  ].join(" ");

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;