import { jsxs, jsx } from "react/jsx-runtime";
import { Facebook, Instagram } from "lucide-react";
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "border-t border-border relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 top-0 h-px ring-divider" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6 py-10 sm:py-14 flex flex-col sm:flex-row items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center", children: [
          /* @__PURE__ */ jsx("span", { className: "font-display text-sm font-extrabold text-primary-foreground", children: "آ" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl ring-1 ring-white/20" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "font-display font-bold", children: "آش مول" }),
          /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-xs", children: "السوق الذكي لمدينة أشمون" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("a", { href: "https://www.facebook.com/profile.php?id=100086715692183", target: "_blank", rel: "noopener noreferrer", className: "hover:text-foreground transition", children: /* @__PURE__ */ jsx(Facebook, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("a", { href: "https://www.instagram.com/ashmall.eg?igsh=MWdseThtMHl4dDZpMg==", target: "_blank", rel: "noopener noreferrer", className: "hover:text-foreground transition", children: /* @__PURE__ */ jsx(Instagram, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsx("span", { className: "w-px h-4 bg-border" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground transition", children: "الشروط" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground transition", children: "الخصوصية" }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "hover:text-foreground transition", children: "تواصل معنا" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " آش مول. صُمّم في أشمون، مصر."
      ] })
    ] })
  ] });
}
export {
  Footer as F
};
