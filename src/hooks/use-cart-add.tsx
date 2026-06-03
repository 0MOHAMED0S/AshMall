import { useServerFn } from "@tanstack/react-start";
import { addToCart, replaceCartAndAdd } from "@/lib/cart.functions";
import { bumpBadges } from "@/hooks/use-badge-counts";

type AddArgs = {
  store_id: string;
  name: string;
  quantity?: number;
  price?: number;
  notes?: string;
};

/**
 * Single-store cart guard: if the user's cart contains items from a different
 * store, ask them to confirm clearing the cart before adding the new item.
 * Each order ships from one store with its own delivery, so we never mix.
 */
export function useCartAdd() {
  const add = useServerFn(addToCart);
  const replace = useServerFn(replaceCartAndAdd);

  return async (args: AddArgs) => {
    const payload = { quantity: 1, ...args };
    try {
      await add({ data: payload });
      bumpBadges();
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === "CART_STORE_CONFLICT") {
        const ok =
          typeof window !== "undefined" &&
          window.confirm(
            "سلتك تحتوي منتجات من متجر آخر.\nكل طلب يكون من متجر واحد فقط (دليفري منفصل).\n\nهل تريد تفريغ السلة وإضافة هذا المنتج؟",
          );
        if (!ok) throw new Error("تم الإلغاء");
        await replace({ data: payload });
        bumpBadges();
      } else {
        throw e;
      }
    }
  };
}
