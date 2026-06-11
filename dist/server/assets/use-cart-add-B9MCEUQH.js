import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { a as addToCart, b as replaceCartAndAdd } from "./cart.functions-dSYgTWmf.js";
import { b as bumpBadges } from "./Nav-C1MbaG3s.js";
function useCartAdd() {
  const add = useServerFn(addToCart);
  const replace = useServerFn(replaceCartAndAdd);
  return async (args) => {
    const payload = { quantity: 1, ...args };
    try {
      await add({ data: payload });
      bumpBadges();
    } catch (e) {
      const msg = e.message;
      if (msg === "CART_STORE_CONFLICT") {
        const ok = typeof window !== "undefined" && window.confirm(
          "سلتك تحتوي منتجات من متجر آخر.\nكل طلب يكون من متجر واحد فقط (دليفري منفصل).\n\nهل تريد تفريغ السلة وإضافة هذا المنتج؟"
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
export {
  useCartAdd as u
};
