import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

type PreferenceValues = Omit<TablesInsert<"user_scheme_preferences">, "user_id">;
const deviceStorageKey = "udyami-scheme-preferences";

export async function fetchSchemePreferences(userId?: string): Promise<PreferenceValues | null> {
  if (!userId) {
    const stored = localStorage.getItem(deviceStorageKey);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  const { data, error } = await supabase
    .from("user_scheme_preferences")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveSchemePreferences(userId: string | undefined, preferences: PreferenceValues) {
  if (!userId) {
    localStorage.setItem(deviceStorageKey, JSON.stringify(preferences));
    return preferences;
  }

  const { data, error } = await supabase
    .from("user_scheme_preferences")
    .upsert({ ...preferences, id: preferences.id ?? userId, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
