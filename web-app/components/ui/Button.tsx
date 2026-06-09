import React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth = false, ...props }, ref) => {
    const base =
      "px-4 py-2 rounded-lg font-medium transition duration-200";

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-green-600 text-white hover:bg-green-700",
      secondary: "bg-yellow-400 text-black hover:bg-yellow-500",
      outline:
        "border border-green-600 text-green-600 hover:bg-green-50",
      danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
      <button
        ref={ref}
        className={cn(
          base,
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;