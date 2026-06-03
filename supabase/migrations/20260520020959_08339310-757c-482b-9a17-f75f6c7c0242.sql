
-- ============ REVIEWS ============
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, user_id)
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY reviews_public_read ON public.reviews FOR SELECT USING (true);
CREATE POLICY reviews_owner_insert ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY reviews_owner_update ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY reviews_owner_delete ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY reviews_admin_all ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reviews_store ON public.reviews(store_id);

-- Recompute store rating when reviews change
CREATE OR REPLACE FUNCTION public.recompute_store_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target UUID;
BEGIN
  target := COALESCE(NEW.store_id, OLD.store_id);
  UPDATE public.stores s
  SET rating = COALESCE((SELECT ROUND(AVG(rating)::numeric, 2) FROM public.reviews WHERE store_id = target), 0),
      rating_count = (SELECT COUNT(*) FROM public.reviews WHERE store_id = target)
  WHERE s.id = target;
  RETURN NULL;
END; $$;

CREATE TRIGGER reviews_recompute_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.recompute_store_rating();

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notifications_select_own ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notifications_update_own ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notifications_delete_own ON public.notifications FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY notifications_admin_all ON public.notifications FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

-- Notify owner on store status change
CREATE OR REPLACE FUNCTION public.notify_store_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.notifications (user_id, title, body, type, link)
    VALUES (
      NEW.owner_id,
      CASE NEW.status
        WHEN 'approved' THEN 'تمّت الموافقة على متجرك ✅'
        WHEN 'rejected' THEN 'تم رفض طلب متجرك'
        WHEN 'suspended' THEN 'تم تعليق متجرك مؤقتاً'
        ELSE 'تحديث على حالة متجرك'
      END,
      'متجر "' || NEW.name_ar || '" — الحالة الجديدة: ' || NEW.status,
      CASE NEW.status WHEN 'approved' THEN 'success' WHEN 'rejected' THEN 'error' ELSE 'info' END,
      '/dashboard'
    );
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER stores_notify_status_change
AFTER UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.notify_store_status_change();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ============ ADS ============
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY ads_public_read ON public.ads FOR SELECT
  USING (active = true AND (ends_at IS NULL OR ends_at > now()) AND starts_at <= now());
CREATE POLICY ads_admin_all ON public.ads FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============ STORAGE BUCKET ============
INSERT INTO storage.buckets (id, name, public) VALUES ('store-media', 'store-media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "store_media_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'store-media');
CREATE POLICY "store_media_owner_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'store-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "store_media_owner_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'store-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "store_media_owner_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'store-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============ SEED CATEGORIES ============
INSERT INTO public.categories (slug, name_ar, name_en, icon, sort_order) VALUES
  ('restaurants', 'المطاعم', 'Restaurants', 'utensils', 1),
  ('cafes', 'الكافيهات', 'Cafés', 'coffee', 2),
  ('fashion', 'الأزياء', 'Fashion', 'shirt', 3),
  ('pharmacy', 'الصيدليات', 'Pharmacies', 'pill', 4),
  ('electronics', 'الإلكترونيات', 'Electronics', 'smartphone', 5),
  ('beauty', 'التجميل', 'Beauty', 'sparkles', 6),
  ('gifts', 'الهدايا', 'Gifts', 'gift', 7),
  ('services', 'الخدمات', 'Services', 'wrench', 8)
ON CONFLICT (slug) DO NOTHING;

-- ============ SEED SAMPLE STORES ============
INSERT INTO public.stores (slug, name_ar, name_en, description_ar, category_id, address, phone, whatsapp, status, is_featured, rating, rating_count, tags)
SELECT * FROM (VALUES
  ('noor-pharmacy', 'صيدلية نور', 'Noor Pharmacy', 'صيدلية موثّقة 24 ساعة بقلب أشمون، أدوية ومستلزمات طبية.', (SELECT id FROM public.categories WHERE slug='pharmacy'), 'شارع الجمهورية، أشمون', '+201001234567', '201001234567', 'approved'::store_status, true, 4.9, 128, ARRAY['مفتوح الآن','توصيل سريع']),
  ('mashweyat-ashmoun', 'مشويات أشمون', 'Ashmoun Grill', 'أفخم مشويات وكباب بلدي على الفحم منذ 1998.', (SELECT id FROM public.categories WHERE slug='restaurants'), 'ميدان الساعة، أشمون', '+201112345678', '201112345678', 'approved'::store_status, true, 4.8, 342, ARRAY['رائج','عائلي']),
  ('atelier-55', 'أتيليه ٥٥', 'Atelier 55', 'تصاميم نسائية أنيقة وخامات بريميوم.', (SELECT id FROM public.categories WHERE slug='fashion'), 'شارع المحطة، أشمون', '+201223456789', '201223456789', 'approved'::store_status, true, 4.7, 89, ARRAY['جديد','حصري']),
  ('volt-electronics', 'فولت للإلكترونيات', 'Volt Electronics', 'موبايلات، لابتوبات، وإكسسوارات أصلية بضمان.', (SELECT id FROM public.categories WHERE slug='electronics'), 'شارع 23 يوليو، أشمون', '+201334567890', '201334567890', 'approved'::store_status, true, 4.9, 215, ARRAY['مميّز','ضمان رسمي']),
  ('brew-bean', 'برو آند بين', 'Brew & Bean', 'قهوة مختصّة وأجواء هادئة للدراسة والعمل.', (SELECT id FROM public.categories WHERE slug='cafes'), 'كورنيش النيل، أشمون', '+201445678901', '201445678901', 'approved'::store_status, false, 4.8, 167, ARRAY['الأكثر طلبًا','واي فاي']),
  ('lumin-beauty', 'لومين للتجميل', 'Lumin Beauty', 'مستحضرات تجميل عالمية ومنتجات عناية بالبشرة.', (SELECT id FROM public.categories WHERE slug='beauty'), 'شارع البحر، أشمون', '+201556789012', '201556789012', 'approved'::store_status, false, 4.9, 94, ARRAY['الأعلى تقييمًا'])
) AS v(slug, name_ar, name_en, description_ar, category_id, address, phone, whatsapp, status, is_featured, rating, rating_count, tags)
WHERE NOT EXISTS (SELECT 1 FROM public.stores WHERE stores.slug = v.slug);

-- ============ SEED AD ============
INSERT INTO public.ads (title, subtitle, link, sort_order, active)
SELECT 'افتتاح متجرك في آش مول مجاناً', 'انضمّ لأكبر سوق رقمي في أشمون', '/auth', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.ads);
