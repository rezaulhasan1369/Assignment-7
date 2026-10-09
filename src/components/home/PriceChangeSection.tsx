import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

type PriceChangeSectionProps = {
  title: string;
  description: string;
  products: Product[];
  variant: "up" | "down";
};

export default function PriceChangeSection({
  title,
  description,
  products,
  variant,
}: PriceChangeSectionProps) {
  const isIncrease = variant === "up";

  return (
    <section className="container-main section-spacing">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className={`mb-2 text-sm font-semibold ${
              isIncrease ? "text-green-700" : "text-red-600"
            }`}
          >
            {isIncrease ? "মূল্যবৃদ্ধি" : "মূল্যহ্রাস"}
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-gray-600">
            {description}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            isIncrease
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {isIncrease ? "▲" : "▼"}{" "}
          {new Intl.NumberFormat("bn-BD").format(products.length)} টি পণ্য
        </span>
      </div>

      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">
            এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
          </p>
        </div>
      )}
    </section>
  );
}