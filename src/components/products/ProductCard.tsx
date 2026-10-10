import Link from "next/link";
import type { Product } from "@/types/product";
import { formatUnit } from "@/lib/format-unit";

type ProductCardProps = {
  product: Product;
};

function toBangla(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const badgeStyle = isUp
    ? "bg-green-50 text-green-700"
    : isDown
      ? "bg-red-50 text-red-700"
      : "bg-gray-100 text-gray-600";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-4xl">
          {product.image}
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
        >
          {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
          {toBangla(Math.abs(product.change.pct))}%
        </span>
      </div>

      <h3 className="mb-1 text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">
        {product.nameBn}
      </h3>

      <p className="mb-5 text-sm text-gray-500">
        {product.categoryNameBn} · {formatUnit(product.unit)}
      </p>

      <div className="flex items-end justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <p className="mt-1 text-2xl font-bold text-green-800">
            ৳{toBangla(product.today)}
          </p>
        </div>

        <span className="text-sm font-semibold text-green-700">
          বিস্তারিত দেখুন →
        </span>
      </div>
    </Link>
  );
}
