import type { Category } from "@/types/category";
import type { Product } from "@/types/product";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const API_URLS = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function fetchCollection<T>(resource: "products" | "categories"): Promise<T[]> {
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl}/${resource}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data: unknown = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return data as T[];
      }
      throw new Error(`Empty or invalid ${resource} API response`);
    } catch (error) {
      console.error(`Failed to fetch ${resource} from ${baseUrl}`, error);
    }
  }

  throw new Error(`Unable to load BazarDor ${resource}.`);
}

// Cache validated results, rather than raw responses or empty UI fallbacks.
// Revalidation failures keep the last successful result; cold failures retry
// on a later request. React cache deduplicates calls within a render.
export const getProducts = cache(unstable_cache(
  () => fetchCollection<Product>("products"),
  ["bazardor-products-official-v2"],
  { revalidate: 300 },
));

export const getCategories = cache(unstable_cache(
  () => fetchCollection<Category>("categories"),
  ["bazardor-categories-official-v2"],
  { revalidate: 300 },
));
