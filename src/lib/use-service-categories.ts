"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "./service-categories";

export async function fetchServiceCategoriesClient(): Promise<ServiceCategory[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("id, label, short, emoji, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch {
    // ignore, fall back to the static list
  }
  return SERVICE_CATEGORIES;
}

export function useServiceCategories(): ServiceCategory[] {
  const [categories, setCategories] = useState<ServiceCategory[]>(
    SERVICE_CATEGORIES
  );

  useEffect(() => {
    let alive = true;
    fetchServiceCategoriesClient().then((list) => {
      if (alive) setCategories(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return categories;
}