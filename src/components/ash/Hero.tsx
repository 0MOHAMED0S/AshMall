import { Search, Sparkles, ArrowUpLeft, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import heroCity from "@/assets/hero-city.jpg";
import { Particles } from "./Particles";
import { Counter } from "./Counter";

const chips = [
  "صيدليات مفتوحة الآن",
  "أفضل كشري قريب مني",
  "إصلاح الآيفون",
  "هدايا أقل من ٥٠٠ جنيه",
];

export function Hero() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (text: string) => { if (text.trim()) navigate({ to: "/search", search: { q: text } }); };
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-40 sm:pb-32">
      {/* Background image + cinematic overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroCity}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-55 scale-110 mask-fade-b"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </div>


      {/* Floating particles */}
      <div className="absolute inset-0 -z-10">
        <Particles density={45} />
      </div>

      {/* Ambient orbs */}
      <div
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-50 blur-3xl animate-pulse-glow"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 60%)" }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] top-1/3 -z-10 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center">
        {/* Live status badge */}
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] sm:text-xs text-muted-foreground animate-rise">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          مباشر في أشمون · <Counter value={247} format="ar" /> متجر موثّق
        </div>

        <h1 className="mt-6 font-display text-[40px] leading-[1.12] sm:text-[80px] sm:leading-[1.02] font-black tracking-[-0.02em] animate-rise reveal-delay-1">
          <span className="text-gradient-soft">الهايبر ماركت</span>
          <br className="hidden sm:block" />
          <span className="text-gradient-brand"> الرقمي لأشمون</span>
        </h1>


        <p className="mx-auto mt-5 sm:mt-6 max-w-xl text-[15px] sm:text-lg text-muted-foreground leading-relaxed animate-rise reveal-delay-2">
          كل محلات وخدمات مدينة أشمون في مكان واحد — تسوّق، اطلب، وتتبّع توصيلك في دقائق
          بتجربة سينمائية مدعومة بالذكاء الاصطناعي.
        </p>


        <form onSubmit={(e) => { e.preventDefault(); submit(q); }} className="mx-auto mt-8 sm:mt-10 max-w-2xl animate-rise reveal-delay-3">
          <div className="glass-strong group relative flex items-center gap-2 sm:gap-3 rounded-2xl p-1.5 sm:p-2 ps-4 sm:ps-5 transition-all duration-500 focus-within:glow-ring hover:-translate-y-0.5">
            <Sparkles className="h-4 w-4 text-primary shrink-0" />
            <input
              type="text"
              dir="rtl"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="اسأل أي شيء — «صيدلية مفتوحة قريبة مني»"
              className="flex-1 bg-transparent py-2.5 sm:py-3 text-sm sm:text-base placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium text-primary-foreground hover:opacity-95 transition active:scale-95">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">ابحث</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {chips.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => { setQ(c); submit(c); }}
                className={`group inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-[11px] sm:text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-secondary/70 transition-all duration-300 hover:-translate-y-0.5 animate-rise reveal-delay-${Math.min(5, i + 2)}`}
              >
                {c}
                <ArrowUpLeft className="h-3 w-3 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition" />
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
            <ShieldCheck className="h-3 w-3 text-primary" />
            كل المتاجر موثّقة يدويًا بعنوان فعلي داخل أشمون
          </div>
        </form>

        {/* Stats */}
        <div className="mx-auto mt-14 sm:mt-20 grid max-w-3xl grid-cols-3 gap-4 sm:gap-6 animate-rise reveal-delay-4">
          {[
            { k: 247, v: "متجر موثّق", suffix: "" },
            { k: 12, v: "زائر شهريًا", suffix: "K+" },
            { k: 4.9, v: "متوسط التقييم", suffix: "", dec: 1 },
          ].map((s) => (
            <div key={s.v} className="text-center">
              <div className="font-display text-3xl sm:text-5xl font-extrabold text-gradient-soft">
                <Counter value={s.k} suffix={s.suffix} decimals={s.dec ?? 0} format="en" />
              </div>
              <div className="mt-1.5 text-[10px] sm:text-xs tracking-wider text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
