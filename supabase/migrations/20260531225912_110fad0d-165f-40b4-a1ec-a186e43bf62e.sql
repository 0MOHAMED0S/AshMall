-- 1) Product type enum
DO $$ BEGIN
  CREATE TYPE public.product_type AS ENUM ('general', 'clothing', 'food');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Sections (أقسام داخل المحل: منيو/مجموعة ملابس...)
CREATE TABLE IF NOT EXISTS public.product_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_sections_store ON public.product_sections(store_id, sort_order);

GRANT SELECT ON public.product_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_sections TO authenticated;
GRANT ALL ON public.product_sections TO service_role;

ALTER TABLE public.product_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sections_public_read" ON public.product_sections FOR SELECT
USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.status = 'approved'));

CREATE POLICY "sections_owner_all" ON public.product_sections FOR ALL
USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid()));

CREATE POLICY "sections_admin_all" ON public.product_sections FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_sections_updated_at BEFORE UPDATE ON public.product_sections
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) Extend products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES public.product_sections(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS product_type public.product_type NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS stock INTEGER,
  ADD COLUMN IF NOT EXISTS sku TEXT;

CREATE INDEX IF NOT EXISTS idx_products_section ON public.products(section_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(product_type);

-- 4) Product variants (مقاسات + ألوان للملابس)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  color_hex TEXT,
  sku TEXT,
  price NUMERIC,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);

GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "variants_public_read" ON public.product_variants FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.status = 'approved'
));

CREATE POLICY "variants_owner_all" ON public.product_variants FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.owner_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.owner_id = auth.uid()
));

CREATE POLICY "variants_admin_all" ON public.product_variants FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_variants_updated_at BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5) Product extras (إضافات اختيارية للمطاعم: جبنة، صوص...)
CREATE TABLE IF NOT EXISTS public.product_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_extras_product ON public.product_extras(product_id);

GRANT SELECT ON public.product_extras TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_extras TO authenticated;
GRANT ALL ON public.product_extras TO service_role;

ALTER TABLE public.product_extras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "extras_public_read" ON public.product_extras FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.status = 'approved'
));

CREATE POLICY "extras_owner_all" ON public.product_extras FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.owner_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.products p
  JOIN public.stores s ON s.id = p.store_id
  WHERE p.id = product_id AND s.owner_id = auth.uid()
));

CREATE POLICY "extras_admin_all" ON public.product_extras FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));