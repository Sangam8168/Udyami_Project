import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { starterSchemes } from "./starterSchemes";

type Scheme = Omit<Tables<"schemes">, "created_at" | "updated_at" | "is_active">;
type SchemeFilters = {
  search?: string;
  categories?: string[];
  state?: string;
  limit?: number;
};

function quoteFilterValue(value: string) {
  return '"' + value.replace(/[\\"]/g, "\\$&") + '"';
}

export async function fetchSchemes({
  search = "",
  categories = [],
  state,
  limit,
}: SchemeFilters = {}): Promise<Scheme[]> {
  const searchTerm = search.trim();
  let query = supabase.from("schemes").select("*").eq("is_active", true);

  if (searchTerm) {
    const pattern = quoteFilterValue(`%${searchTerm}%`);
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},ministry_department.ilike.${pattern}`
    );
  }
  if (categories.length) query = query.in("category", categories);
  if (state) query = query.or(`state.eq.${quoteFilterValue(state)},state.is.null`);
  if (limit) query = query.limit(limit);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  if (data.length) return data;

  if (searchTerm || categories.length || state) {
    const { data: activeSchemes, error: catalogError } = await supabase
      .from("schemes")
      .select("id")
      .eq("is_active", true)
      .limit(1);

    if (catalogError) throw catalogError;
    if (activeSchemes.length) return [];
  }

  const keyword = searchTerm.toLowerCase();
  return starterSchemes
    .filter((scheme) =>
      (!categories.length || categories.includes(scheme.category)) &&
      (!state || scheme.state === null || scheme.state === state) &&
      [scheme.name, scheme.description, scheme.ministry_department]
        .some((field) => field.toLowerCase().includes(keyword))
    )
    .slice(0, limit);
}
