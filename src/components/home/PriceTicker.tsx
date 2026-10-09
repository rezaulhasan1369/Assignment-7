import type { Product } from "@/types/product";

type PriceTickerProps = {
  products: Product[];
};

function toBangla(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function PriceTicker({ products }: PriceTickerProps) {
  if (products.length === 0) return null;

  const repeatedProducts = [...products, ...products];

  return (
    <div className="overflow-hidden border-b border-green-100 bg-green-50 py-3">
      <div className="ticker-track flex w-max items-center">
        {repeatedProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="flex shrink-0 items-center gap-2 px-6 text-sm font-medium"
          >
            <span>{product.image}</span>

            <span className="text-gray-800">{product.nameBn}</span>

            <span className="font-bold text-green-800">
              ৳{toBangla(product.today)}
            </span>

            <span
              className={
                product.change.dir === "up"
                  ? "text-green-700"
                  : product.change.dir === "down"
                    ? "text-red-600"
                    : "text-gray-500"
              }
            >
              {product.change.dir === "up"
                ? "▲"
                : product.change.dir === "down"
                  ? "▼"
                  : "—"}

              {toBangla(Math.abs(product.change.pct))}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}