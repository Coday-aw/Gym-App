import React from "react";

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
};

const Label = ({ children, htmlFor }: LabelProps) => {
  return (
    <label
      htmlFor={htmlFor}
      className="text-slate-400 uppercase text-xs tracking-widest font-semibold"
    >
      {children}
    </label>
  );
};

export default Label;