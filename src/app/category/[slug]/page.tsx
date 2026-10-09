import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryProductList from "@/components/products/CategoryProductList";

import { getCategories, getProducts } from "@/lib/api";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category === slug
  );

  return (
  <>
    <Navbar categories={categories} />

    <main className="container-main py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-slate-500 hover:text-emerald-700">
          ← হোমপেজে ফিরে যান
        </Link>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          {category.icon} {category.nameBn}
        </h1>

        <p className="mt-2 text-slate-600">
          এই ক্যাটাগরিতে মোট {categoryProducts.length.toLocaleString("bn-BD")}টি পণ্য রয়েছে।
        </p>
      </div>

      <CategoryProductList products={categoryProducts} />
        </main>

    <Footer />
  </>
  );
}