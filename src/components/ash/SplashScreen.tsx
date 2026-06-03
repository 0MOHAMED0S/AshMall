import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/logo-splash.png.asset.json";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.location.pathname !== "/") return;
    setShow(true);

    const duration = 2200;
    const start = performance.now();
    // easeOutCubic for a natural fast-then-settle feel
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.round(ease(t) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setLeaving(true), duration + 250);
    const t2 = setTimeout(() => setShow(false), duration + 950);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return null;


  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-all duration-700 ${
        leaving ? "opacity-0 scale-110" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, #f5efe3 0%, #ebe2cf 50%, #d9cfb8 100%)",
      }}
      aria-hidden={leaving}
    >
      {/* Animated rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="splash-ring splash-ring-1" />
        <span className="splash-ring splash-ring-2" />
        <span className="splash-ring splash-ring-3" />
      </div>

      {/* Orbiting dots */}
      <div className="pointer-events-none absolute h-[420px] w-[420px] animate-[splash-spin_8s_linear_infinite]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "#0d5a47",
              transform: `rotate(${i * 30}deg) translateY(-200px)`,
              opacity: 0.15 + (i % 4) * 0.2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div className="relative flex flex-col items-center">
        <div className="relative">
          {/* Glow halo */}
          <div
            className="absolute inset-0 -m-12 rounded-full blur-3xl animate-[splash-pulse_2s_ease-in-out_infinite]"
            style={{ background: "radial-gradient(circle, rgba(13,90,71,0.35), transparent 70%)" }}
          />
          <img
            src={logoAsset.url}
            alt="آش مول"
            width={180}
            height={180}
            className="relative h-44 w-44 sm:h-52 sm:w-52 object-contain drop-shadow-2xl animate-[splash-logo_1.4s_cubic-bezier(0.22,1,0.36,1)_both]"
          />
        </div>

        {/* Wordmark */}
        <div className="mt-8 overflow-hidden">
          <h1
            className="font-serif text-3xl sm:text-4xl font-black tracking-[0.18em] animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_0.5s_both]"
            style={{ color: "#0d5a47", fontFamily: "'Playfair Display', 'Cairo', 'Tajawal', serif" }}
          >
            ASH MALL
          </h1>
        </div>
        <div className="overflow-hidden">
          <p
            className="mt-2 text-[11px] sm:text-xs font-bold animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_0.8s_both]"
            style={{ color: "#0d5a47", opacity: 0.7, fontFamily: "'Cairo', 'Tajawal', 'IBM Plex Sans Arabic', sans-serif", letterSpacing: "0.15em" }}
          >
            السوق الذكي لأشمون
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-56 sm:w-64 animate-[splash-rise_1s_cubic-bezier(0.22,1,0.36,1)_1s_both]">
          <div
            className="relative h-[6px] w-full overflow-hidden rounded-full"
            style={{ background: "rgba(13,90,71,0.12)", boxShadow: "inset 0 1px 2px rgba(13,90,71,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-100 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #0d5a47, #1a8a6e, #0d5a47)",
                boxShadow: "0 0 10px rgba(13,90,71,0.5)",
              }}
            >
              <div
                className="absolute inset-0 animate-[splash-shimmer_1.2s_linear_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
                }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold tracking-wider tabular-nums" style={{ color: "#0d5a47" }}>
            <span style={{ opacity: 0.7 }}>جارٍ التحميل…</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splash-logo {
          0% { opacity: 0; transform: scale(0.6) rotate(-8deg); filter: blur(8px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        @keyframes splash-rise {
          0% { opacity: 0; transform: translateY(100%); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splash-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes splash-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes splash-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes splash-ring-expand {
          0% { width: 180px; height: 180px; opacity: 0.8; border-width: 2px; }
          100% { width: 600px; height: 600px; opacity: 0; border-width: 1px; }
        }
        .splash-ring {
          position: absolute;
          border-radius: 9999px;
          border: 2px solid #0d5a47;
          animation: splash-ring-expand 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .splash-ring-1 { animation-delay: 0s; }
        .splash-ring-2 { animation-delay: 0.7s; }
        .splash-ring-3 { animation-delay: 1.4s; }
      `}</style>
    </div>
  );
}
