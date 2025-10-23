import React, { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ placeholder, ...props }: InputProps) => {
  return (
    <input
      placeholder={placeholder}
      {...props}
      className={twMerge(
        "w-full  px-4 py-2   border-2 focus:border-surface  cursor-text transition-colors focus:bg-stone-900 text-base font-light duration-100 outline-none rounded-sm border-border/50",
        props.className,
      )}
    ></input>
  );
};

export default Input;
