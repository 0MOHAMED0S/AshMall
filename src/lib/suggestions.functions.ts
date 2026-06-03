import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/** Fast autocomplete: stores + products + categories matching a partial query */
export const searchSuggestions = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ q: z.string().trim().min(1).max(80) }).parse(i))
  .handler(async ({ data }) => {
    const safe = data.q.replace(/[%,()]/g, "");
    const pattern = `%${safe}%`;

    const [storesRes, productsRes, catsRes] = await Promise.all([
      supabaseAdmin
        .from("stores")
        .select("id, slug, name_ar, logo_url, categories(name_ar)")
        .eq("status", "approved")
        .or(`name_ar.ilike.${pattern},description_ar.ilike.${pattern}`)
        .limit(5),
      supabaseAdmin
        .from("products")
        .select("id, name_ar, price, image_url, store_id, stores!inner(slug, name_ar, status)")
        .eq("is_available", true)
        .eq("stores.status", "approved")
        .ilike("name_ar", pattern)
        .limit(6),
      supabaseAdmin
        .from("categories")
        .select("slug, name_ar, icon")
        .ilike("name_ar", pattern)
        .limit(3),
    ]);

    return {
      stores: storesRes.data ?? [],
      products: productsRes.data ?? [],
      categories: catsRes.data ?? [],
    };
  });
