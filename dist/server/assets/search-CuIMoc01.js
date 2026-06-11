import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { N as Nav } from "./Nav-C1MbaG3s.js";
import { F as Footer } from "./Footer-BKRcK99m.js";
import { u as useServerFn } from "./useServerFn-DL2oePlL.js";
import { g as createSsrRpc, R as Route } from "./router-B21PHlE4.js";
import { z } from "zod";
import { a as createServerFn } from "./server-Dxshj7Uq.js";
import { S as StoreCard } from "./StoreCard-xxkag-y8.js";
import { Wand2, Sparkles, X, Loader2, Search, ShieldCheck, ArrowUpLeft, History } from "lucide-react";
import "./client-1xsKmu53.js";
import "@supabase/supabase-js";
import "@tanstack/react-query";
import "sonner";
import "./auth-middleware-tARyaGyP.js";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router/ssr/server";
const smartSearch = createServerFn({
  method: "POST"
}).inputValidator((i) => z.object({
  query: z.string().trim().min(1).max(300)
}).parse(i)).handler(createSsrRpc("cfe34a05ba5e852b008f6bec897d2b36fca1ee6c5201253018d2604dac687329"));
const SUGGESTIONS = ["صيدليات مفتوحة الآن", "أفضل كشري قريب مني", "محل إصلاح موبايلات", "كافيه هادي للمذاكرة", "هدايا أقل من ٥٠٠ جنيه", "سوبر ماركت توصيل"];
const RECENT_KEY = "ash_recent_searches";
function SearchPage() {
  const navigate = useNavigate();
  const {
    q
  } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const runSearch = useServerFn(smartSearch);
  const didAutoRun = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
    }
  }, []);
  async function go(text) {
    const t = text.trim();
    if (!t) return;
    setQuery(t);
    setLoading(true);
    navigate({
      to: "/search",
      search: {
        q: t
      }
    });
    try {
      const res = await runSearch({
        data: {
          query: t
        }
      });
      setResults(res);
      const next = [t, ...recent.filter((x) => x !== t)].slice(0, 6);
      setRecent(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
      }
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (q && !didAutoRun.current) {
      didAutoRun.current = true;
      void go(q);
    }
  }, [q]);
  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
    }
  }
  const showIntro = !loading && !results;
  const count = results?.stores.length ?? 0;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", dir: "rtl", children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("header", { className: "relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14", children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute left-1/2 top-10 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-50 blur-3xl animate-pulse-glow", style: {
        background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)"
      } }),
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-x-0 top-0 -z-10 h-full", style: {
        background: "var(--gradient-warm)"
      } }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-5 sm:px-6 text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] sm:text-xs text-muted-foreground animate-rise", children: [
          /* @__PURE__ */ jsx(Wand2, { className: "h-3.5 w-3.5 text-primary" }),
          "بحث ذكي مدعوم بالذكاء الاصطناعي"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-5 font-display text-[34px] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-black tracking-[-0.02em] animate-rise reveal-delay-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gradient-soft", children: "اسأل بلغتك،" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-gradient-brand", children: "نفهم ونوصّلك." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed animate-rise reveal-delay-2", children: "اكتب طلبك بأي طريقة — نفهم النية ونرشّح لك أنسب المتاجر داخل أشمون." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          void go(query);
        }, className: "mx-auto mt-8 sm:mt-10 max-w-2xl animate-rise reveal-delay-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "glass-strong group relative flex items-center gap-2 sm:gap-3 rounded-2xl p-1.5 sm:p-2 ps-4 sm:ps-5 transition-all duration-500 focus-within:glow-ring hover:-translate-y-0.5", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary shrink-0" }),
            /* @__PURE__ */ jsx("input", { ref: inputRef, autoFocus: true, value: query, onChange: (e) => setQuery(e.target.value), placeholder: "مثال: صيدلية مفتوحة قريبة، أو كافيه هادي للمذاكرة", className: "flex-1 min-w-0 bg-transparent py-2.5 sm:py-3 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none" }),
            query && !loading && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
              setQuery("");
              inputRef.current?.focus();
            }, className: "grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition", "aria-label": "مسح", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading || !query.trim(), className: "inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed", children: [
              loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: loading ? "جارٍ التفكير..." : "ابحث" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3 text-primary" }),
            "نتائج من متاجر موثّقة فقط داخل أشمون"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-6xl px-5 sm:px-6 pb-24", children: [
      showIntro && /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:gap-8 sm:grid-cols-2 animate-rise reveal-delay-4", children: [
        /* @__PURE__ */ jsxs("section", { className: "soft-card p-6 sm:p-7", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-bold", children: "جرّب هذه الأسئلة" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => void go(s), className: "group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5", children: [
            s,
            /* @__PURE__ */ jsx(ArrowUpLeft, { className: "h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" })
          ] }, s)) })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "soft-card p-6 sm:p-7", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-xl bg-accent text-accent-foreground", children: /* @__PURE__ */ jsx(History, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-bold", children: "آخر عمليات البحث" })
            ] }),
            recent.length > 0 && /* @__PURE__ */ jsx("button", { onClick: clearRecent, className: "text-[11px] text-muted-foreground hover:text-destructive transition", children: "مسح الكل" })
          ] }),
          recent.length === 0 ? /* @__PURE__ */ jsx("p", { className: "mt-4 text-xs text-muted-foreground leading-relaxed", children: "لم تبحث عن شيء بعد — ستظهر هنا عمليات بحثك السابقة لتعود إليها بسرعة." }) : /* @__PURE__ */ jsx("ul", { className: "mt-4 divide-y divide-border/60", children: recent.map((r) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { onClick: () => void go(r), className: "group flex w-full items-center justify-between gap-3 py-2.5 text-sm text-foreground/85 hover:text-foreground transition", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 min-w-0", children: [
              /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "truncate", children: r })
            ] }),
            /* @__PURE__ */ jsx(ArrowUpLeft, { className: "h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" })
          ] }) }, r)) })
        ] })
      ] }),
      results?.intent && !loading && /* @__PURE__ */ jsxs("div", { className: "mt-2 mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm animate-rise", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary shrink-0", children: /* @__PURE__ */ jsx(Wand2, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-primary font-semibold", children: "فهمنا طلبك" }),
          /* @__PURE__ */ jsx("div", { className: "mt-0.5 text-foreground", children: results.intent })
        ] })
      ] }),
      results?.error === "rate_limit" && /* @__PURE__ */ jsx(ErrorBox, { text: "تم تجاوز حد طلبات البحث الذكي مؤقتًا. حاول بعد لحظات." }),
      results?.error === "credits" && /* @__PURE__ */ jsx(ErrorBox, { text: "نفدت أرصدة الذكاء الاصطناعي. أضف رصيدًا للمتابعة." }),
      !loading && results && results.stores.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 mb-5 flex items-baseline justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("h2", { className: "font-display text-xl sm:text-2xl font-bold", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gradient-soft", children: "النتائج" }),
          /* @__PURE__ */ jsxs("span", { className: "ms-2 text-sm font-medium text-muted-foreground tabular-nums", children: [
            count.toLocaleString("ar-EG"),
            " متجر"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3 text-primary" }),
          "متاجر موثّقة"
        ] })
      ] }),
      (loading || results && results.stores.length > 0) && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5", children: [
        loading && Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-3xl overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "h-44 shimmer" }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 rounded-md shimmer" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 rounded-md shimmer" }),
            /* @__PURE__ */ jsx("div", { className: "h-3 w-full rounded-md shimmer" }),
            /* @__PURE__ */ jsx("div", { className: "h-9 w-full rounded-xl shimmer mt-2" })
          ] })
        ] }, i)),
        !loading && results?.stores.map((s) => /* @__PURE__ */ jsx(StoreCard, { s }, s.id))
      ] }),
      !loading && results && results.stores.length === 0 && !results.error && /* @__PURE__ */ jsxs("div", { className: "mt-8 soft-card p-12 text-center animate-rise", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto h-16 w-16 grid place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20", children: /* @__PURE__ */ jsx(Search, { className: "h-7 w-7" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-5 font-display text-xl font-bold", children: "لم نجد نتائج مطابقة" }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed", children: "جرّب صياغة أخرى أو كلمات أبسط — أو اختر من الاقتراحات التالية." }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex flex-wrap justify-center gap-2", children: SUGGESTIONS.slice(0, 4).map((s) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => void go(s), className: "rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/80 transition", children: s }, s)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function ErrorBox({
  text
}) {
  return /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive px-5 py-4 text-sm", children: text });
}
export {
  SearchPage as component
};
