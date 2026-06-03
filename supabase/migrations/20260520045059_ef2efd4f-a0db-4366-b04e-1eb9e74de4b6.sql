
-- Fix favorites FK so PostgREST can join stores
ALTER TABLE public.favorites
  ADD CONSTRAINT favorites_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;

-- Order status enum
DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('pending','confirmed','preparing','delivering','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'EGP',
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user ON public.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_store ON public.orders(store_id, created_at DESC);

CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders RLS
CREATE POLICY orders_admin_all ON public.orders FOR ALL USING (has_role(auth.uid(),'admin'));
CREATE POLICY orders_select_own ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_insert_own ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY orders_update_own ON public.orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY orders_store_owner_select ON public.orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid()));
CREATE POLICY orders_store_owner_update ON public.orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.owner_id = auth.uid()));

-- Order items RLS
CREATE POLICY order_items_admin_all ON public.order_items FOR ALL USING (has_role(auth.uid(),'admin'));
CREATE POLICY order_items_select_own ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY order_items_insert_own ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY order_items_store_owner_select ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o JOIN public.stores s ON s.id = o.store_id WHERE o.id = order_items.order_id AND s.owner_id = auth.uid()));

-- updated_at trigger
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Notify on insert + status change
CREATE OR REPLACE FUNCTION public.notify_order_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner UUID;
  store_name TEXT;
BEGIN
  SELECT s.owner_id, s.name_ar INTO owner, store_name FROM public.stores s WHERE s.id = NEW.store_id;

  IF TG_OP = 'INSERT' THEN
    IF owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (owner, 'طلب جديد 🛍️', 'لديك طلب جديد في متجر "' || store_name || '"', 'info', '/dashboard');
    END IF;
    INSERT INTO public.notifications (user_id, title, body, type, link)
    VALUES (NEW.user_id, 'تم استلام طلبك ✅', 'طلبك من "' || store_name || '" قيد المراجعة.', 'success', '/orders');
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, body, type, link)
    VALUES (
      NEW.user_id,
      CASE NEW.status
        WHEN 'confirmed' THEN 'تم تأكيد طلبك ✅'
        WHEN 'preparing' THEN 'جارٍ تحضير طلبك 👨‍🍳'
        WHEN 'delivering' THEN 'طلبك في الطريق 🚚'
        WHEN 'completed' THEN 'تم تسليم طلبك 🎉'
        WHEN 'cancelled' THEN 'تم إلغاء طلبك'
        ELSE 'تحديث على طلبك'
      END,
      'طلبك من "' || store_name || '"',
      CASE NEW.status WHEN 'cancelled' THEN 'error' WHEN 'completed' THEN 'success' ELSE 'info' END,
      '/orders'
    );
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER orders_notify AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.notify_order_changes();
