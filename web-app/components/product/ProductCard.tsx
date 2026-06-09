"use client";

import React from "react";
import Image from "next/image";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";

type ProductStatus = "ready" | "low" | "empty";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  status?: ProductStatus;
  discount?: number;
  className?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  status = "ready",
  discount,
  className,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  const finalPrice =
    discount ? price - (price * discount) / 100 : price;

  const getBadge = () => {
    switch (status) {
      case "ready":
        return <Badge variant="success">Tersedia</Badge>;
      case "low":
        return <Badge variant="warning">Stok Terbatas</Badge>;
      case "empty":
        return <Badge variant="danger">Habis</Badge>;
    }
  };

  return (
    <Card hover className={cn("p-3", className)}>
      {/* IMAGE */}
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <Image src={image} alt={name} fill className="object-cover" />

        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
            -{discount}%
          </div>
        )}
      </div>

      {/* TITLE */}
      <h3 className="mt-2 text-sm font-semibold line-clamp-2">
        {name}
      </h3>

      {/* PRICE */}
      <div className="mt-1">
        {discount ? (
          <>
            <p className="text-gray-400 line-through text-xs">
              Rp {formatPrice(price)}
            </p>
            <p className="text-green-600 font-bold">
              Rp {formatPrice(finalPrice)}
            </p>
          </>
        ) : (
          <p className="text-green-600 font-bold">
            Rp {formatPrice(price)}
          </p>
        )}
      </div>

      {/* STATUS */}
      <div className="mt-2">{getBadge()}</div>

      {/* ACTION */}
      <Button
        variant="primary"
        disabled={status === "empty"}
        className="mt-3"
        onClick={() =>
          addItem({
            id,
            name,
            price: finalPrice,
            image,
          })
        }
      >
        {status === "empty" ? "Habis" : "Tambah ke Keranjang"}
      </Button>
    </Card>
  );
}