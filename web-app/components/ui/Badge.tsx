import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export default function Badge({
  className,
  variant = "success",
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-full font-medium inline-flex items-center",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}