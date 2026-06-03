import { ShieldCheck, BarChart3, Megaphone, ArrowLeft } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "موثّق فقط", body: "كل متجر يُراجع يدويًا بعنوان فعلي داخل أشمون. لا متاجر إلكترونية وهمية." },
  { icon: BarChart3, title: "تحليلات ذكية", body: "إحصاءات لحظية: زيارات، تحويلات، أداء الإعلانات وسلوك العملاء." },
  { icon: Megaphone, title: "إعلانات ذكية", body: "حملات مستهدفة عبر الصفحة الرئيسية، البحث والتوصيات الذكية." },
];

export function ForBusiness() {
  return (
    <section id="business" className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 py-20 sm:py-28">
        <div
          className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] glass-strong p-8 sm:p-16 grain"
          style={{ boxShadow: "var(--shadow-elevated)" }}
        >
          <div
            className="absolute -top-32 -start-32 h-96 w-96 rounded-full blur-3xl opacity-40 animate-pulse-glow"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div
            className="absolute -bottom-40 -end-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
          />

          <div className="relative grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
            <div>
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary font-medium">للشركات</div>
              <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient-soft">
                ضمّ متجرك إلى المدينة الذكية.
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md leading-relaxed">
                لوحة تحكم احترافية، اكتشاف مدعوم بالذكاء الاصطناعي، وقاعدة عملاء تعيش بالفعل في أشمون.
                الإعداد في دقائق — والموافقة خلال ٢٤ ساعة.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/201213442141?text=${encodeURIComponent("السلام عليكم، عاوز أسجّل متجري في تطبيق آش مول وأعرف التفاصيل والأسعار. شكراً.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:opacity-95 transition-all glow-ring active:scale-95 inline-flex items-center gap-2"
                >
                  سجّل متجرك
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </a>
              </div>
            </div>

            <div className="grid gap-3">
              {items.map(({ icon: Icon, title, body }, i) => (
                <div
                  key={title}
                  className="group flex gap-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-md p-5 hover:border-primary/30 hover:bg-surface/80 transition-all duration-500 hover:-translate-y-0.5"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
