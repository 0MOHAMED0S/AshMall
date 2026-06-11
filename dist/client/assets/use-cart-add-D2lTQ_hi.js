import{u as o}from"./useServerFn-BHbL6f_U.js";import{a as d,b as i}from"./cart.functions-Lk67XoLf.js";import{b as r}from"./Nav-CH5hPpGr.js";function w(){const n=o(d),e=o(i);return async s=>{const a={quantity:1,...s};try{await n({data:a}),r()}catch(t){if(t.message==="CART_STORE_CONFLICT"){if(!(typeof window<"u"&&window.confirm(`سلتك تحتوي منتجات من متجر آخر.
كل طلب يكون من متجر واحد فقط (دليفري منفصل).

هل تريد تفريغ السلة وإضافة هذا المنتج؟`)))throw new Error("تم الإلغاء");await e({data:a}),r()}else throw t}}}export{w as u};
