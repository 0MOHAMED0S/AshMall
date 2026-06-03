import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { listActiveAds } from "@/lib/ads.functions";

interface Ad { id: string; title: string; subtitle: string | null; image_url: string | null; link: string | null; }

export function HeroBanner() {
  const fetchAds = useServerFn(listActiveAds);
  const [ads, setAds] = useState<Ad[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetchAds().then((r) => setAds((r.ads ?? []) as Ad[])).catch(() => { /* ignore */ });
  }, [fetchAds]);

  useEffect(() => {
    if (ads.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % ads.length), 5500);
    return () => clearInterval(t);
  }, [ads.length]);

  if (ads.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 sm:pt-6">
      <div
        className="relative overflow-hidden rounded-3xl bg-[#f3ede1] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.18)] ring-1 ring-black/5"
        style={{ aspectRatio: "1080 / 540" }}
      >
        {ads.map((ad, i) => (
          <Link
            key={ad.id}
            to={(ad.link ?? "/stores") as never}
            className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {ad.image_url && (
              <img
                src={ad.image_url}
                alt={ad.title}
                className="absolute inset-0 h-full w-full object-cover object-center select-none"
                draggable={false}
              />
            )}
          </Link>
        ))}

        {ads.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {ads.map((_, i) => (
              <button
                key={i}
                aria-label={`عرض ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-primary/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
