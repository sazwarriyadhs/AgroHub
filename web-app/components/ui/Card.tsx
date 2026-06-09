import React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export default function Card({
  className,
  hover = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-gray-100 rounded-xl shadow-sm",
        hover && "hover:shadow-md transition duration-200",
        className
      )}
      {...props}
    />
  );
}