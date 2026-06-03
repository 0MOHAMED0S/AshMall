import { useEffect, useMemo, useState } from "react";
import { Star, Send, Quote, MessageSquareHeart } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { listReviews, submitReview } from "@/lib/reviews.functions";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null; avatar_url: string | null } | null;
}

const AVATAR_GRADIENTS = [
  "from-orange-400/40 to-rose-300/20",
  "from-amber-400/40 to-yellow-300/20",
  "from-emerald-400/40 to-teal-300/20",
  "from-sky-400/40 to-indigo-300/20",
  "from-violet-400/40 to-fuchsia-300/20",
  "from-pink-400/40 to-rose-300/20",
];

function pickGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "الآن";
  if (diff < 3600) return `منذ ${Math.floor(diff / 60)} د`;
  if (diff < 86400) return `منذ ${Math.floor(diff / 3600)} س`;
  if (diff < 2592000) return `منذ ${Math.floor(diff / 86400)} يوم`;
  return new Date(date).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

export function Reviews({ storeId }: { storeId: string }) {
  const { user } = useAuth();
  const fetchReviews = useServerFn(listReviews);
  const submit = useServerFn(submitReview);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetchReviews({ data: { storeId } });
      setReviews((r.reviews ?? []) as Review[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [storeId]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((n) => ({
      n,
      count: reviews.filter((r) => r.rating === n).length,
      pct: total ? (reviews.filter((r) => r.rating === n).length / total) * 100 : 0,
    }));
    return { total, avg, dist };
  }, [reviews]);

  const visible = showAll ? reviews : reviews.slice(0, 4);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await submit({ data: { store_id: storeId, rating, comment: comment.trim() || undefined } });
      setComment("");
      toast.success("شكراً لتقييمك!");
      await load();
    } catch {
      toast.error("تعذّر إرسال التقييم");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabel = ["", "سيء", "مقبول", "جيد", "ممتاز", "رائع جداً"][hoverRating || rating];

  return (
    <section className="mt-12">
      <div className="flex items-end justify-between mb-6 gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-medium">تجارب حقيقية</div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">آراء العملاء</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 border border-border px-3 py-1.5 text-xs text-muted-foreground">
          <MessageSquareHeart className="h-3.5 w-3.5 text-primary" />
          <span className="tabular-nums">{stats.total}</span> تقييم
        </span>
      </div>

      {/* Rating summary */}
      {stats.total > 0 && (
        <div className="glass-card rounded-3xl p-5 sm:p-6 mb-6 animate-rise">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-5 sm:gap-8 items-center">
            <div className="text-center sm:text-right sm:border-l sm:border-border sm:pl-8">
              <div className="font-display text-5xl sm:text-6xl font-extrabold tabular-nums bg-gradient-to-b from-primary to-primary/60 bg-clip-text text-transparent">
                {stats.avg.toFixed(1)}
              </div>
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-4 w-4 ${n <= Math.round(stats.avg) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">من {stats.total} تقييم</div>
            </div>
            <div className="space-y-1.5">
              {stats.dist.map((d) => (
                <div key={d.n} className="flex items-center gap-3 text-xs">
                  <span className="w-3 tabular-nums text-muted-foreground">{d.n}</span>
                  <Star className="h-3 w-3 fill-primary text-primary shrink-0" />
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-left tabular-nums text-muted-foreground">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit form */}
      {user ? (
        <form onSubmit={onSubmit} className="glass-card rounded-2xl p-5 mb-6 animate-rise">
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} نجوم`}
                className="p-1 transition-transform duration-200 hover:scale-125"
              >
                <Star className={`h-7 w-7 transition-colors ${n <= (hoverRating || rating) ? "fill-primary text-primary drop-shadow-[0_0_8px_oklch(0.7_0.19_45_/_0.5)]" : "text-muted-foreground/30"}`} />
              </button>
            ))}
            <span className="ms-2 text-xs text-muted-foreground">{ratingLabel}</span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شارك تجربتك مع هذا المتجر..."
            rows={3}
            maxLength={500}
            className="mt-3 w-full bg-secondary/40 border border-border rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 transition resize-none"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[10px] text-muted-foreground tabular-nums">{comment.length}/500</span>
            <button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold disabled:opacity-50 active:scale-95 transition shadow-sm hover:shadow-md">
              <Send className="h-3.5 w-3.5" /> {submitting ? "جارٍ الإرسال…" : "إرسال التقييم"}
            </button>
          </div>
        </form>
      ) : (
        <div className="glass-card rounded-2xl p-5 mb-6 text-center text-sm text-muted-foreground">
          <Link to="/auth" search={{ redirect: typeof window !== "undefined" ? window.location.pathname : "/" }} className="text-primary hover:underline font-medium">سجّل دخولك</Link> لإضافة تقييمك.
        </div>
      )}

      {/* Review cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-2xl bg-secondary/30 animate-pulse" />)
        ) : reviews.length === 0 ? (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground">
            <MessageSquareHeart className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
            لا توجد تقييمات بعد — كن أول من يقيّم.
          </div>
        ) : (
          visible.map((r, i) => {
            const name = r.profiles?.full_name ?? "مستخدم";
            const grad = pickGradient(r.user_id || r.id);
            return (
              <article
                key={r.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group relative overflow-hidden glass-card rounded-2xl p-5 animate-rise hover:-translate-y-1 hover:border-primary/30 transition-all duration-500"
              >
                <Quote className="absolute top-3 left-3 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-11 w-11 shrink-0 rounded-full bg-gradient-to-br ${grad} grid place-items-center text-sm font-bold ring-1 ring-white/10`}>
                      {r.profiles?.avatar_url ? (
                        <img src={r.profiles.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        name.slice(0, 1)
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{name}</div>
                      <div className="text-[11px] text-muted-foreground">{timeAgo(r.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-3.5 w-3.5 ${n <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/25"}`} />
                    ))}
                  </div>
                </div>
                {r.comment && (
                  <p className="relative mt-3 text-sm text-foreground/90 leading-relaxed line-clamp-4">{r.comment}</p>
                )}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </article>
            );
          })
        )}
      </div>

      {reviews.length > 4 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm font-medium hover:border-primary/40 transition"
          >
            {showAll ? "عرض أقل" : `عرض كل التقييمات (${reviews.length})`}
          </button>
        </div>
      )}
    </section>
  );
}
