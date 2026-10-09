"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types/product";

type CategoryProductListProps = {
  products: Product[];
};

type SortOption = "default" | "low-to-high" | "high-to-low";

export default function CategoryProductList({
  products,
}: CategoryProductListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const sortedProducts = [...products];

  if (sortOption === "low-to-high") {
    sortedProducts.sort((a, b) => a.today - b.today);
  }

  if (sortOption === "high-to-low") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          মোট {products.length.toLocaleString("bn-BD")}টি পণ্য
        </p>

        <div className="flex items-center gap-3">
          <label
            htmlFor="category-sort"
            className="text-sm font-medium text-slate-700"
          >
            সাজান:
          </label>

          <select
            id="category-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none focus:border-emerald-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-slate-600">
            এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
          </p>
        </div>
      )}
    </section>
  );
}