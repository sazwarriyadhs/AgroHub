import ProductCard from "./ProductCard";

type Product = {
  name: string;
  price: number;
  image: string;
  status?: "ready" | "low" | "empty";
  discount?: number;
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((item, index) => (
        <ProductCard key={index} {...item} />
      ))}
    </div>
  );
}