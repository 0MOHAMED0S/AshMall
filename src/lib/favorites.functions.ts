import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listFavorites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("favorites")
      .select("id, store_id, created_at, stores(id, slug, name_ar, name_en, rating, rating_count, cover_url, logo_url, address, categories(name_ar, slug))")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { favorites: data ?? [] };
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ store_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("favorites")
      .select("id")
      .eq("user_id", context.userId)
      .eq("store_id", data.store_id)
      .maybeSingle();
    if (existing) {
      const { error } = await context.supabase.from("favorites").delete().eq("id", existing.id);
      if (error) throw new Error(error.message);
      return { favorited: false };
    }
    const { error } = await context.supabase
      .from("favorites")
      .insert({ user_id: context.userId, store_id: data.store_id });
    if (error) throw new Error(error.message);
    return { favorited: true };
  });

export const isFavorited = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ store_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("favorites")
      .select("id")
      .eq("user_id", context.userId)
      .eq("store_id", data.store_id)
      .maybeSingle();
    return { favorited: !!row };
  });
