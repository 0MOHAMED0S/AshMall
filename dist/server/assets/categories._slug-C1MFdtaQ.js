import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
const SplitNotFoundComponent = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center", dir: "rtl", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsx("h1", { className: "font-display text-3xl font-bold", children: "الفئة غير موجودة" }),
  /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm", children: "الرئيسية" })
] }) });
export {
  SplitNotFoundComponent as notFoundComponent
};
