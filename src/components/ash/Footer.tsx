import { Facebook, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border relative">
      <div className="absolute inset-x-0 top-0 h-px ring-divider" />
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center">
            <span className="font-display text-sm font-extrabold text-primary-foreground">آ</span>
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
          </div>
          <div className="text-sm">
            <div className="font-display font-bold">آش مول</div>
            <div className="text-muted-foreground text-xs">السوق الذكي لمدينة أشمون</div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <a href="https://www.facebook.com/profile.php?id=100086715692183" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/ashmall.eg?igsh=MWdseThtMHl4dDZpMg==" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
            <Instagram className="w-5 h-5" />
          </a>
          <span className="w-px h-4 bg-border" />
          <a href="#" className="hover:text-foreground transition">الشروط</a>
          <a href="#" className="hover:text-foreground transition">الخصوصية</a>
          <a href="#" className="hover:text-foreground transition">تواصل معنا</a>
        </div>
        <div className="text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} آش مول. صُمّم في أشمون، مصر.
        </div>
      </div>
    </footer>
  );
}
