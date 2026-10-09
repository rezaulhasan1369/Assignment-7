import Footer from "@/components/layout/Footer";
import PriceChangeSection from "@/components/home/PriceChangeSection";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/home/PriceTicker";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import Image from "next/image";

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error("Homepage products failed to load:", error);
  }
  const priceIncreases = products
    .filter(
      (product) =>
        product.change.dir === "up" &&
        product.change.pct > 0
    )
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  // Top 6 products with the greatest price decreases
    // Top 6 products with the greatest price decreases
  const priceDecreases = products
    .filter(
      (product) =>
        product.change.dir === "down" &&
        product.change.pct < 0
    )
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);
  return (
  <>
    <Navbar />
    <PriceTicker products={products} />

    <main>
      <section className="container-main section-spacing">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold text-green-700">
              আজকের বাজারদর
            </p>

            <h1 className="mb-5 text-4xl leading-tight font-bold md:text-5xl">
              নিত্যপ্রয়োজনীয় পণ্যের
              <br />
              বাজারদর জানুন সহজেই
            </h1>

            <p className="mb-8 text-lg text-gray-600">
              এক জায়গায় দেখুন বিভিন্ন পণ্যের সর্বশেষ দাম,
              মূল্যবৃদ্ধি ও মূল্যহ্রাসের তথ্য।
            </p>

            <a
              href="#সব-পণ্য"
              className="inline-flex rounded-xl bg-green-700 px-7 py-3 font-semibold text-white transition-colors hover:bg-green-800"
            >
              সব পণ্য দেখুন
            </a>
          </div>

          <div className="flex justify-center">
            <Image
              src="/assets/bazar-hero.png"
              alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
              width={560}
              height={480}
              priority
              className="h-auto w-full max-w-xl object-contain"
            />
          </div>
        </div>
      </section>
              {/* PRICE INCREASE SECTION */}

        <PriceChangeSection
          title="আজ দাম বেড়েছে ▲"
          description="আজ যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে।"
          products={priceIncreases}
          variant="up"
        />

        {/* PRICE DECREASE SECTION */}

        <PriceChangeSection
          title="আজ দাম কমেছে ▼"
          description="আজ যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে।"
          products={priceDecreases}
          variant="down"
        />

      <section
  id="সব-পণ্য"
  className="container-main section-spacing scroll-mt-24"
>
  <div className="mb-8">
    <p className="mb-2 text-sm font-semibold text-green-700">
      নিত্যপ্রয়োজনীয় পণ্য
    </p>

    <h2 className="text-3xl font-bold">সব পণ্য</h2>

    <p className="mt-2 text-gray-600">
      আজকের সর্বশেষ বাজারদর এক নজরে দেখুন।
    </p>
  </div>

  {products.length > 0 ? (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
      <p className="text-gray-600">
        এই মুহূর্তে পণ্যের তথ্য পাওয়া যাচ্ছে না।
      </p>
    </div>
  )}
</section>
    </main>
    <Footer />
    </>
  );
}