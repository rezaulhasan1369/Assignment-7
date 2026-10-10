import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getAuth } from "@/lib/auth";
import { getCategories, getProducts } from "@/lib/api";

import type { Product } from "@/types/product";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPrice(price: number) {
  return price.toLocaleString("bn-BD");
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  // ==========================================
  // 1. BETTER AUTH — SERVER-SIDE SESSION CHECK
  // ==========================================

  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect unauthenticated users to Sign In.
  if (!session) {
    const callbackUrl = `/product/${encodeURIComponent(slug)}`;

    redirect(
      `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    );
  }

  // ==========================================
  // 2. FETCH PRODUCT DATA
  // ==========================================

  let products: Product[];

  try {
    products = await getProducts();
  } catch (error) {
    console.error(
      "Product details data failed to load:",
      error
    );

    throw new Error(
      "Product data is temporarily unavailable."
    );
  }

  // ==========================================
  // 3. FETCH PRODUCT CATEGORIES
  // ==========================================

  let categories: Awaited<
    ReturnType<typeof getCategories>
  > = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error(
      "Product categories failed to load:",
      error
    );
  }

  // ==========================================
  // 4. FIND REQUESTED PRODUCT
  // ==========================================

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  // ==========================================
  // 5. PRICE CHANGE CALCULATIONS
  // ==========================================

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";

  const changeColor = isUp
    ? "text-red-600 bg-red-50"
    : isDown
      ? "text-emerald-700 bg-emerald-50"
      : "text-slate-600 bg-slate-100";

  // ==========================================
  // 6. PRODUCT DETAILS UI
  // ==========================================

  return (
    <>
      <Navbar categories={categories} />

      <main className="container-main py-10">
        {/* Back to homepage */}
        <Link
          href="/"
          className="text-sm text-slate-500 hover:text-emerald-700"
        >
          ← হোমপেজে ফিরে যান
        </Link>

        {/* Main product information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            {/* Product identity */}
            <div>
              <div
                className="mb-4 text-6xl"
                aria-hidden="true"
              >
                {product.image}
              </div>

              <p className="text-sm text-slate-500">
                {product.categoryNameBn}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-slate-500">
                একক: {product.unit}
              </p>
            </div>

            {/* Today's price */}
            <div className="text-left md:text-right">
              <p className="text-sm text-slate-500">
                আজকের দাম
              </p>

              <p className="mt-2 text-4xl font-bold text-slate-900">
                ৳{formatPrice(product.today)}
              </p>

              <span
                className={`mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold ${changeColor}`}
              >
                {isUp ? "↑" : isDown ? "↓" : "→"}{" "}
                {Math.abs(
                  product.change.pct
                ).toLocaleString("bn-BD")}
                %
              </span>
            </div>
          </div>
        </div>

        {/* ==================================
            PRICE COMPARISON SECTION
           ================================== */}

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            দামের তুলনা
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "আজকের দাম",
                value: product.today,
              },
              {
                label: "গতকালের দাম",
                value: product.yesterday,
              },
              {
                label: "গত সপ্তাহের দাম",
                value: product.lastWeek,
              },
              {
                label: "গত মাসের দাম",
                value: product.lastMonth,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">
                  {item.label}
                </p>

                <p className="mt-3 text-2xl font-bold text-slate-900">
                  ৳{formatPrice(item.value)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================
            MARKET PRICE COMPARISON SECTION
           ================================== */}

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            বাজারভিত্তিক দামের তালিকা
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[560px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-700">
                <tr>
                  <th className="px-5 py-4">
                    বাজার
                  </th>

                  <th className="px-5 py-4">
                    বিভাগ
                  </th>

                  <th className="px-5 py-4">
                    সর্বনিম্ন দাম
                  </th>

                  <th className="px-5 py-4">
                    সর্বোচ্চ দাম
                  </th>
                </tr>
              </thead>

              <tbody>
                {product.markets.map(
                  (market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-t border-slate-100 text-sm text-slate-700"
                    >
                      <td className="px-5 py-4">
                        {market.market}
                      </td>

                      <td className="px-5 py-4">
                        {market.division}
                      </td>

                      <td className="px-5 py-4">
                        ৳{formatPrice(market.min)}
                      </td>

                      <td className="px-5 py-4">
                        ৳{formatPrice(market.max)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* Empty market data */}
            {product.markets.length === 0 && (
              <p className="p-6 text-center text-slate-500">
                বাজারভিত্তিক তথ্য পাওয়া যায়নি।
              </p>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
