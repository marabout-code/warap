import { createClient } from "@/lib/supabase/server";
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "./service-categories";

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_categories")
    .select("id, label, short, emoji, sort_order")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (data && data.length > 0) {
    return data;
  }

  return SERVICE_CATEGORIES;
}