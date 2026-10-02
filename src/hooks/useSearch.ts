"use client";

import { useCallback, useState } from "react";
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
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`
        );
        if (!response.ok) throw new Error("فشل البحث");
        const data = await response.json();
        setResults((data as Product[]) ?? []);
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