import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("cart_items")
      .select("id, store_id, name, quantity, price, notes, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((data ?? []).map((r) => r.store_id)));
    let storesById: Record<string, { id: string; slug: string; name_ar: string; logo_url: string | null; phone: string | null; whatsapp: string | null }> = {};
    if (ids.length > 0) {
      const { data: s } = await context.supabase
        .from("stores")
        .select("id, slug, name_ar, logo_url, phone, whatsapp")
        .in("id", ids);
      storesById = Object.fromEntries((s ?? []).map((r) => [r.id, r]));
    }
    const items = (data ?? []).map((r) => ({ ...r, stores: storesById[r.store_id] ?? null }));
    return { items };
  });

export const addToCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      store_id: z.string().uuid(),
      name: z.string().trim().min(1).max(120),
      quantity: z.number().int().min(1).max(999).default(1),
      price: z.number().min(0).max(1_000_000).optional(),
      notes: z.string().trim().max(300).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    // Single-store cart enforcement
    const { data: existing, error: exErr } = await context.supabase
      .from("cart_items")
      .select("store_id")
      .eq("user_id", context.userId)
      .limit(50);
    if (exErr) throw new Error(exErr.message);
    const conflict = (existing ?? []).some((r) => r.store_id !== data.store_id);
    if (conflict) throw new Error("CART_STORE_CONFLICT");

    const { error } = await context.supabase.from("cart_items").insert({
      user_id: context.userId,
      store_id: data.store_id,
      name: data.name,
      quantity: data.quantity,
      price: data.price ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Clears the cart then adds a fresh item — used after the user confirms swapping store.
export const replaceCartAndAdd = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      store_id: z.string().uuid(),
      name: z.string().trim().min(1).max(120),
      quantity: z.number().int().min(1).max(999).default(1),
      price: z.number().min(0).max(1_000_000).optional(),
      notes: z.string().trim().max(300).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error: delErr } = await context.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", context.userId);
    if (delErr) throw new Error(delErr.message);
    const { error } = await context.supabase.from("cart_items").insert({
      user_id: context.userId,
      store_id: data.store_id,
      name: data.name,
      quantity: data.quantity,
      price: data.price ?? null,
      notes: data.notes ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().min(1).max(999),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cart_items")
      .update({ quantity: data.quantity })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cart_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("cart_items")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
