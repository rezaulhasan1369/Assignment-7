import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const API_URLS = [
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

export async function getProducts(): Promise<Product[]> {
  for (const baseUrl of API_URLS) {
    try {
      const response = await fetch(`${baseUrl}/products`, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        continue;
      }

      const data: unknown = await response.json();

      if (Array.isArray(data)) {
        return data as Product[];
      }
    } catch (error) {
      console.error(`Failed to fetch products from ${baseUrl}`, error);
    }
  }

  throw new Error("Unable to load BazarDor products.");
}

export async function getCategories(): Promise<Category[]> {
  const endpoints = [
    "https://api.api-store.workers.dev/api/bazardor/categories",
    "https://api.abcz.workers.dev/api/bazardor/categories",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        next: { revalidate: 300 },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid categories API response");
      }

      return data as Category[];
    } catch (error) {
      console.error(`Category API failed: ${endpoint}`, error);
    }
  }

  throw new Error("Unable to fetch categories from either API");
}