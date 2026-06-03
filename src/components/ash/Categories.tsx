import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listCategoriesWithCounts } from "@/lib/stores.functions";
import offersImg from "@/assets/cat-offers.jpg";
import restaurantsImg from "@/assets/cat-restaurants.jpg";
import cafesImg from "@/assets/cat-cafes.jpg";
import fashionImg from "@/assets/cat-fashion.jpg";
import pharmacyImg from "@/assets/cat-pharmacy.jpg";
import electronicsImg from "@/assets/cat-electronics.jpg";
import beautyImg from "@/assets/cat-beauty.jpg";
import giftsImg from "@/assets/cat-gifts.jpg";
import servicesImg from "@/assets/cat-services.jpg";
import supermarketImg from "@/assets/cat-supermarket.jpg";
import homeImg from "@/assets/cat-home.jpg";
import donateImg from "@/assets/cat-donate.jpg";
import bekiaImg from "@/assets/cat-bekia.jpg";

const imageBySlug: Record<string, string> = {
  restaurants: restaurantsImg,
  cafes: cafesImg,
  fashion: fashionImg,
  pharmacy: pharmacyImg,
  pharmacies: pharmacyImg,
  electronics: electronicsImg,
  beauty: beautyImg,
  gifts: giftsImg,
  services: servicesImg,
  supermarket: supermarketImg,
  "home-goods": homeImg,
  donate: donateImg,
  bekia: bekiaImg,
};

// Always show these categories even with 0 stores
const ALWAYS_SHOW = new Set(["services", "supermarket", "home-goods", "donate", "bekia"]);
// Show "قريبًا" hover overlay only for these
const COMING_SOON = new Set(["services"]);

interface Cat { id: string; slug: string; name_ar: string; icon: string | null; count: number; }

const fallbackCats: Cat[] = [
  { id: "restaurants", slug: "restaurants", name_ar: "المطاعم", icon: null, count: 1 },
  { id: "cafes", slug: "cafes", name_ar: "الكافيهات", icon: null, count: 1 },
  { id: "fashion", slug: "fashion", name_ar: "الأزياء", icon: null, count: 1 },
  { id: "pharmacy", slug: "pharmacy", name_ar: "الصيدليات", icon: null, count: 1 },
  { id: "electronics", slug: "electronics", name_ar: "الإلكترونيات", icon: null, count: 1 },
  { id: "beauty", slug: "beauty", name_ar: "التجميل", icon: null, count: 1 },
];

export function Categories() {
  const fetchCats = useServerFn(listCategoriesWithCounts);
  const [cats, setCats] = useState<Cat[]>(fallbackCats);

  useEffect(() => {
    fetchCats()
      .then((r) => {
        const list = (r.categories ?? []) as Cat[];
        // Dedupe by normalized name_ar (and slug fallback) — keep highest count
        const map = new Map<string, Cat>();
        for (const c of list) {
          const key = (c.name_ar || c.slug).trim().replace(/\s+/g, " ");
          const existing = map.get(key);
          if (!existing || (c.count ?? 0) > (existing.count ?? 0)) map.set(key, c);
        }
        // Show ALL categories from admin (any new category added by admin appears immediately)
        setCats(Array.from(map.values()));
      })
      .catch(() => setCats(fallbackCats));
  }, [fetchCats]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ down: false, moved: false, startX: 0, startScroll: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return; // let native touch scroll work
    dragState.current = { down: true, moved: false, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !dragState.current.down) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) dragState.current.moved = true;
    el.scrollLeft = dragState.current.startScroll - dx;
  };
  const onPointerUp = () => {
    dragState.current.down = false;
    setTimeout(() => { dragState.current.moved = false; }, 0);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 sm:px-6 pt-2">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        className="flex gap-3 sm:gap-5 overflow-x-auto no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 select-none touch-pan-x cursor-grab active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Offers always first */}
        <Link to="/stores" draggable={false} className="shrink-0 flex flex-col items-center gap-2 min-w-[76px] group">
          <div className="relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px] rounded-3xl overflow-hidden border-2 border-primary/40 shadow-[var(--shadow-chip)] group-hover:shadow-[var(--shadow-glow)] transition-all">
            <div role="img" aria-label="عروض وخصومات" className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition pointer-events-none" style={{ backgroundImage: `url(${offersImg})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent" />
            <span className="absolute top-1 left-1 rounded-full bg-primary text-primary-foreground text-[9px] font-extrabold px-1.5 py-0.5 shadow">جديد</span>
          </div>
          <div className="text-[11px] sm:text-xs font-extrabold text-center text-primary max-w-[88px] leading-tight">عروض وخصومات</div>
        </Link>

        {cats.map((c) => {
              const img = imageBySlug[c.slug];
              const soon = COMING_SOON.has(c.slug);
              const Tag: any = soon ? "button" : "a";
              const tagProps = soon
                ? { type: "button", onClick: (e: React.MouseEvent) => e.preventDefault() }
                : { href: `/categories/${c.slug}` };
              return (
                <Tag key={c.id} {...tagProps} draggable={false} className="shrink-0 flex flex-col items-center gap-2 group min-w-[76px] text-center">
                  <div className="relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px] rounded-3xl overflow-hidden border border-border bg-card shadow-[var(--shadow-chip)] group-hover:border-primary/40 group-hover:shadow-[var(--shadow-soft)] transition-all">
                    {img ? (
                      <div role="img" aria-label={c.name_ar} className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition pointer-events-none" style={{ backgroundImage: `url(${img})` }} />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-primary-soft text-primary font-display text-2xl font-extrabold">
                        {c.name_ar.slice(0, 1)}
                      </div>
                    )}
                    {soon && (
                      <div className="absolute inset-0 grid place-items-center bg-background/55 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 transition-opacity">
                        <span className="rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold px-2.5 py-1 shadow-[var(--shadow-glow)]">قريبًا</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-center text-foreground/90 max-w-[88px] truncate leading-tight">{c.name_ar}</div>
                </Tag>
              );
            })}
      </div>
    </section>
  );
}
