import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const listActiveAds = createServerFn({ method: "GET" })
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("ads")
      .select("id, title, subtitle, image_url, link, sort_order")
      .eq("active", true)
      .lte("starts_at", new Date().toISOString())
      .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
      .order("sort_order")
      .limit(6);
    if (error) throw new Error(error.message);
    return { ads: data ?? [] };
  });
