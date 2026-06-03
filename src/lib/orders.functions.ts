import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const placeOrdersFromCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      phone: z.string().trim().min(3).max(40).optional(),
      address: z.string().trim().min(1).max(500).optional(),
      notes: z.string().trim().max(500).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: items, error } = await supabase
      .from("cart_items")
      .select("id, store_id, name, quantity, price, notes")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    if (!items || items.length === 0) throw new Error("السلة فارغة");

    // Group by store
    const groups = new Map<string, typeof items>();
    for (const it of items) {
      if (!groups.has(it.store_id)) groups.set(it.store_id, [] as typeof items);
      groups.get(it.store_id)!.push(it);
    }

    const orderIds: string[] = [];
    for (const [storeId, list] of groups) {
      const total = list.reduce((s, r) => s + Number(r.price ?? 0) * r.quantity, 0);
      const { data: order, error: oerr } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          store_id: storeId,
          total,
          phone: data.phone ?? null,
          address: data.address ?? null,
          notes: data.notes ?? null,
        })
        .select("id")
        .single();
      if (oerr || !order) throw new Error(oerr?.message ?? "تعذّر إنشاء الطلب");
      const { error: ierr } = await supabase.from("order_items").insert(
        list.map((it) => ({
          order_id: order.id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
          notes: it.notes,
        })),
      );
      if (ierr) throw new Error(ierr.message);
      orderIds.push(order.id);
    }

    await supabase.from("cart_items").delete().eq("user_id", userId);
    return { ok: true, orderIds };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, status, total, currency, created_at, store_id, phone, address, notes, order_items(id, name, quantity, price, notes)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((data ?? []).map((r) => r.store_id)));
    let stores: Record<string, { id: string; slug: string; name_ar: string; logo_url: string | null }> = {};
    if (ids.length) {
      const { data: s } = await context.supabase
        .from("stores").select("id, slug, name_ar, logo_url").in("id", ids);
      stores = Object.fromEntries((s ?? []).map((r) => [r.id, r]));
    }
    return { orders: (data ?? []).map((o) => ({ ...o, store: stores[o.store_id] ?? null })) };
  });

export const cancelMyOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", data.id)
      .eq("user_id", context.userId)
      .in("status", ["pending", "confirmed"]);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
