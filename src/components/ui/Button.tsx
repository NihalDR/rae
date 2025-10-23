import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Variant = "filled" | "outline" | "text";

const variants: Record<Variant, string> = {
  filled:
    "rounded-sm hover:brightness-95 bg-gradient-to-b from-surface to-surface/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]",
  outline:
    "border-2 font-medium hover:bg-foreground/10 border-border focus:border-surface !outline-none",
  text: "",
};

// Extend button props for proper typing, including className
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const Button = ({
  variant = "filled",
  children,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      // whileTap={{ scale: 0.9 }}
      onClick={onClick}
      {...props}
      className={twMerge(
        `${variants[variant]} px-4 py-2 text-shadow-2xs text-shadow-black/50 rounded-sm !cursor-pointer  duration-200 transition-colors`,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
