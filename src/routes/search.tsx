import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Nav } from "@/components/ash/Nav";
import { Footer } from "@/components/ash/Footer";
import { useServerFn } from "@tanstack/react-start";
import { smartSearch } from "@/lib/search.functions";
import { StoreCard } from "@/components/ash/StoreCard";
import { Sparkles, Search, Loader2, Wand2, History, X, ArrowUpLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "" }),
  component: SearchPage,
  head: () => ({
    meta: [
      { title: "بحث ذكي — آش مول" },
      { name: "description", content: "ابحث في كل متاجر وخدمات مدينة أشمون بلغة طبيعية مدعومة بالذكاء الاصطناعي." },
    ],
  }),
});

const SUGGESTIONS = [
  "صيدليات مفتوحة الآن",
  "أفضل كشري قريب مني",
  "محل إصلاح موبايلات",
  "كافيه هادي للمذاكرة",
  "هدايا أقل من ٥٠٠ جنيه",
  "سوبر ماركت توصيل",
];

const RECENT_KEY = "ash_recent_searches";

function SearchPage() {
  const navigate = useNavigate();
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<Awaited<ReturnType<typeof smartSearch>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const runSearch = useServerFn(smartSearch);
  const didAutoRun = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  async function go(text: string) {
    const t = text.trim();
    if (!t) return;
    setQuery(t);
    setLoading(true);
    navigate({ to: "/search", search: { q: t } });
    try {
      const res = await runSearch({ data: { query: t } });
      setResults(res);
      // save to recent
      const next = [t, ...recent.filter((x) => x !== t)].slice(0, 6);
      setRecent(next);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (q && !didAutoRun.current) {
      didAutoRun.current = true;
      void go(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function clearRecent() {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ }
  }

  const showIntro = !loading && !results;
  const count = results?.stores.length ?? 0;

  return (
    <div className="min-h-screen" dir="rtl">
      <Nav />

      {/* Cinematic header */}
      <header className="relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14">
        <div
          className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-50 blur-3xl animate-pulse-glow"
          style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full"
          style={{ background: "var(--gradient-warm)" }}
        />

        <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] sm:text-xs text-muted-foreground animate-rise">
            <Wand2 className="h-3.5 w-3.5 text-primary" />
            بحث ذكي مدعوم بالذكاء الاصطناعي
          </div>

          <h1 className="mt-5 font-display text-[34px] leading-[1.1] sm:text-6xl sm:leading-[1.05] font-black tracking-[-0.02em] animate-rise reveal-delay-1">
            <span className="text-gradient-soft">اسأل بلغتك،</span>{" "}
            <span className="text-gradient-brand">نفهم ونوصّلك.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed animate-rise reveal-delay-2">
            اكتب طلبك بأي طريقة — نفهم النية ونرشّح لك أنسب المتاجر داخل أشمون.
          </p>

          {/* Search bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); void go(query); }}
            className="mx-auto mt-8 sm:mt-10 max-w-2xl animate-rise reveal-delay-3"
          >
            <div className="glass-strong group relative flex items-center gap-2 sm:gap-3 rounded-2xl p-1.5 sm:p-2 ps-4 sm:ps-5 transition-all duration-500 focus-within:glow-ring hover:-translate-y-0.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثال: صيدلية مفتوحة قريبة، أو كافيه هادي للمذاكرة"
                className="flex-1 min-w-0 bg-transparent py-2.5 sm:py-3 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
              />
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition"
                  aria-label="مسح"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-primary to-primary-glow text-primary-foreground px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="hidden sm:inline">{loading ? "جارٍ التفكير..." : "ابحث"}</span>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
              <ShieldCheck className="h-3 w-3 text-primary" />
              نتائج من متاجر موثّقة فقط داخل أشمون
            </div>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-6 pb-24">
        {/* Intro: suggestions + recent */}
        {showIntro && (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 animate-rise reveal-delay-4">
            <section className="soft-card p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h2 className="font-display text-base font-bold">جرّب هذه الأسئلة</h2>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void go(s)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/80 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {s}
                    <ArrowUpLeft className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                  </button>
                ))}
              </div>
            </section>

            <section className="soft-card p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <History className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-base font-bold">آخر عمليات البحث</h2>
                </div>
                {recent.length > 0 && (
                  <button onClick={clearRecent} className="text-[11px] text-muted-foreground hover:text-destructive transition">
                    مسح الكل
                  </button>
                )}
              </div>
              {recent.length === 0 ? (
                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  لم تبحث عن شيء بعد — ستظهر هنا عمليات بحثك السابقة لتعود إليها بسرعة.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border/60">
                  {recent.map((r) => (
                    <li key={r}>
                      <button
                        onClick={() => void go(r)}
                        className="group flex w-full items-center justify-between gap-3 py-2.5 text-sm text-foreground/85 hover:text-foreground transition"
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate">{r}</span>
                        </span>
                        <ArrowUpLeft className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {/* Intent line */}
        {results?.intent && !loading && (
          <div className="mt-2 mb-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm animate-rise">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary shrink-0">
              <Wand2 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">فهمنا طلبك</div>
              <div className="mt-0.5 text-foreground">{results.intent}</div>
            </div>
          </div>
        )}

        {results?.error === "rate_limit" && <ErrorBox text="تم تجاوز حد طلبات البحث الذكي مؤقتًا. حاول بعد لحظات." />}
        {results?.error === "credits" && <ErrorBox text="نفدت أرصدة الذكاء الاصطناعي. أضف رصيدًا للمتابعة." />}

        {/* Results header */}
        {!loading && results && results.stores.length > 0 && (
          <div className="mt-6 mb-5 flex items-baseline justify-between gap-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold">
              <span className="text-gradient-soft">النتائج</span>
              <span className="ms-2 text-sm font-medium text-muted-foreground tabular-nums">
                {count.toLocaleString("ar-EG")} متجر
              </span>
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-primary" />
              متاجر موثّقة
            </span>
          </div>
        )}

        {/* Results grid */}
        {(loading || (results && results.stores.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl overflow-hidden">
                <div className="h-44 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 rounded-md shimmer" />
                  <div className="h-3 w-1/2 rounded-md shimmer" />
                  <div className="h-3 w-full rounded-md shimmer" />
                  <div className="h-9 w-full rounded-xl shimmer mt-2" />
                </div>
              </div>
            ))}
            {!loading && results?.stores.map((s) => (
              <StoreCard key={s.id} s={s as Parameters<typeof StoreCard>[0]["s"]} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && results && results.stores.length === 0 && !results.error && (
          <div className="mt-8 soft-card p-12 text-center animate-rise">
            <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">لم نجد نتائج مطابقة</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
              جرّب صياغة أخرى أو كلمات أبسط — أو اختر من الاقتراحات التالية.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void go(s)}
                  className="rounded-full border border-border bg-secondary/40 px-3.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:border-primary/40 hover:bg-secondary/80 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive px-5 py-4 text-sm">
      {text}
    </div>
  );
}
