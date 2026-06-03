import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((i) => z.object({ storeId: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("reviews")
      .select("id, rating, comment, created_at, user_id")
      .eq("store_id", data.storeId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    // Best-effort profile enrichment
    const userIds = Array.from(new Set((rows ?? []).map((r) => r.user_id)));
    let profilesMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
    if (userIds.length) {
      const { data: profs } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      profilesMap = new Map((profs ?? []).map((p) => [p.id, { full_name: p.full_name, avatar_url: p.avatar_url }]));
    }
    return {
      reviews: (rows ?? []).map((r) => ({ ...r, profiles: profilesMap.get(r.user_id) ?? null })),
    };

  });

export const submitReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      store_id: z.string().uuid(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().trim().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("reviews")
      .upsert(
        { store_id: data.store_id, user_id: context.userId, rating: data.rating, comment: data.comment ?? null },
        { onConflict: "store_id,user_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
