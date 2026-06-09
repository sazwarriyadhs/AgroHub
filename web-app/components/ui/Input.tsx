import { cn } from "@/lib/utils";
import React from "react";

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500",
        className
      )}
      {...props}
    />
  );
}