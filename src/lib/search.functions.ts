import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * AI-powered smart search.
 * Uses Lovable AI Gateway to interpret the user's natural-language query
 * (Arabic) into structured filters, then queries approved stores.
 */
export const smartSearch = createServerFn({ method: "POST" })
  .inputValidator((i) => z.object({ query: z.string().trim().min(1).max(300) }).parse(i))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;

    // Fetch context for the model
    const { data: cats } = await supabaseAdmin
      .from("categories")
      .select("slug, name_ar, name_en");

    let parsed: { category_slugs?: string[]; keywords?: string[]; intent?: string } = {};

    if (apiKey) {
      try {
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: `أنت مساعد بحث ذكي لسوق "آش مول" في مدينة أشمون، مصر. مهمتك تحويل سؤال المستخدم لفلاتر بحث منظّمة. الفئات المتاحة (slugs): ${(cats ?? []).map((c) => `${c.slug}(${c.name_ar})`).join(", ")}. أرجع JSON فقط بهذا الشكل: {"category_slugs": ["..."], "keywords": ["..."], "intent": "وصف قصير لما يبحث عنه المستخدم"}.`,
              },
              { role: "user", content: data.query },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (resp.status === 429) return { stores: [], intent: "تجاوزت حد الطلبات، حاول بعد قليل.", error: "rate_limit" };
        if (resp.status === 402) return { stores: [], intent: "نفدت أرصدة الذكاء الاصطناعي.", error: "credits" };

        if (resp.ok) {
          const json = (await resp.json()) as { choices?: Array<{ message?: { content?: string } }> };
          const content = json.choices?.[0]?.message?.content ?? "{}";
          try { parsed = JSON.parse(content); } catch { /* fall back to keyword search */ }
        }
      } catch (e) {
        console.error("AI search failed, falling back to keyword search:", e);
      }
    }

    // Build query
    let q = supabaseAdmin
      .from("stores")
      .select("id, slug, name_ar, name_en, description_ar, address, rating, rating_count, cover_url, tags, categories(slug, name_ar, icon)")
      .eq("status", "approved")
      .limit(24);

    if (parsed.category_slugs?.length) {
      const { data: catIds } = await supabaseAdmin
        .from("categories")
        .select("id")
        .in("slug", parsed.category_slugs);
      const ids = (catIds ?? []).map((c) => c.id);
      if (ids.length) q = q.in("category_id", ids);
    }

    const keywords = parsed.keywords?.length ? parsed.keywords : [data.query];
    // PostgREST `or` with ilike on name + description + tags
    const orParts: string[] = [];
    keywords.slice(0, 4).forEach((kw) => {
      const safe = kw.replace(/[%,()]/g, "");
      orParts.push(`name_ar.ilike.%${safe}%`);
      orParts.push(`description_ar.ilike.%${safe}%`);
    });
    if (orParts.length) q = q.or(orParts.join(","));

    const { data: stores, error } = await q;
    if (error) console.error("Search error:", error);

    return {
      stores: stores ?? [],
      intent: parsed.intent ?? null,
      error: null as string | null,
    };
  });
