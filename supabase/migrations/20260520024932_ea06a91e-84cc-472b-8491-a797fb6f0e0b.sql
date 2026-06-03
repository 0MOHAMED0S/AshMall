CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  description_ar TEXT,
  price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'EGP',
  image_url TEXT,
  section TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_store ON public.products(store_id);
CREATE INDEX idx_products_section ON public.products(store_id, section);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.status = 'approved')
  );

CREATE POLICY products_owner_read ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY products_owner_insert ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY products_owner_update ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY products_owner_delete ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY products_admin_all ON public.products
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();