"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

interface UseSearchOptions {
  limit?: number;
}

interface UseSearchReturn {
  results: Product[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  reset: () => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { limit = 20 } = options;
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const pattern = `%${trimmed}%`;

        const { data, error: searchError } = await supabase
          .from("products")
          .select("*, category:categories(*), images:product_images(*)")
          .eq("isActive", true)
          .or(`name.ilike.${pattern},description.ilike.${pattern}`)
          .limit(limit);

        if (searchError) throw searchError;

        const matchedCategoryIds = new Set<string>();

        const { data: matchingCategories } = await supabase
          .from("categories")
          .select("id")
          .ilike("name", pattern);

        if (matchingCategories) {
          matchingCategories.forEach((c) => matchedCategoryIds.add(c.id));
        }

        const { data: matchingTags } = await supabase
          .from("products")
          .select("id")
          .ilike("badge", pattern)
          .eq("isActive", true);

        const tagIds = new Set<string>();
        if (matchingTags) {
          matchingTags.forEach((t) => tagIds.add(t.id));
        }

        const allIds = new Set<string>();
        if (data) data.forEach((p) => allIds.add(p.id));
        matchedCategoryIds.forEach((id) => allIds.add(id));
        tagIds.forEach((id) => allIds.add(id));

        if (allIds.size === 0) {
          setResults([]);
          return;
        }

        const { data: finalData, error: finalError } = await supabase
          .from("products")
          .select("*, category:categories(*), images:product_images(*)")
          .in("id", Array.from(allIds))
          .eq("isActive", true)
          .order("name")
          .limit(limit);

        if (finalError) throw finalError;

        setResults((finalData as Product[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  const reset = useCallback(() => {
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, search, reset };
}
