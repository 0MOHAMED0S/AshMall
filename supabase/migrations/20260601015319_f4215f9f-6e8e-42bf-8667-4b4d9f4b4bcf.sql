
-- store_credentials: admin-only table to store generated merchant login info per store
CREATE TABLE IF NOT EXISTS public.store_credentials (
  store_id UUID NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_credentials TO authenticated;
GRANT ALL ON public.store_credentials TO service_role;

ALTER TABLE public.store_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store_credentials_admin_all" ON public.store_credentials
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- delivery_personnel: admin manages list of delivery couriers
CREATE TABLE IF NOT EXISTS public.delivery_personnel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_personnel TO authenticated;
GRANT ALL ON public.delivery_personnel TO service_role;

ALTER TABLE public.delivery_personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_personnel_admin_all" ON public.delivery_personnel
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "delivery_personnel_self_read" ON public.delivery_personnel
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "delivery_personnel_owner_read" ON public.delivery_personnel
  FOR SELECT USING (
    active = true AND EXISTS (
      SELECT 1 FROM public.stores s WHERE s.owner_id = auth.uid()
    )
  );

-- Security definer helper: is current user a delivery courier?
CREATE OR REPLACE FUNCTION public.is_delivery_user(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.delivery_personnel WHERE user_id = _user_id AND active = true)
$$;

-- delivery_requests
CREATE TABLE IF NOT EXISTS public.delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  store_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  assigned_to UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_delivery_requests_order ON public.delivery_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_assigned ON public.delivery_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_status ON public.delivery_requests(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_requests TO authenticated;
GRANT ALL ON public.delivery_requests TO service_role;

ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_requests_admin_all" ON public.delivery_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "delivery_requests_store_owner_select" ON public.delivery_requests
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = delivery_requests.store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "delivery_requests_store_owner_insert" ON public.delivery_requests
  FOR INSERT WITH CHECK (
    auth.uid() = requested_by AND
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "delivery_requests_store_owner_update" ON public.delivery_requests
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.stores s WHERE s.id = delivery_requests.store_id AND s.owner_id = auth.uid())
  );

CREATE POLICY "delivery_requests_delivery_read" ON public.delivery_requests
  FOR SELECT USING (public.is_delivery_user(auth.uid()));

CREATE POLICY "delivery_requests_delivery_update" ON public.delivery_requests
  FOR UPDATE USING (public.is_delivery_user(auth.uid()));

-- Notify store owner on delivery status change
CREATE OR REPLACE FUNCTION public.notify_delivery_request_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE owner UUID;
BEGIN
  SELECT s.owner_id INTO owner FROM public.stores s WHERE s.id = NEW.store_id;
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, body, type, link)
      VALUES (
        owner,
        CASE NEW.status
          WHEN 'accepted' THEN 'الدليفري قبل الطلب 🚴'
          WHEN 'picked_up' THEN 'الدليفري استلم الطلب 📦'
          WHEN 'delivered' THEN 'تم تسليم الطلب للعميل ✅'
          WHEN 'cancelled' THEN 'تم إلغاء طلب الدليفري'
          ELSE 'تحديث على طلب الدليفري'
        END,
        'طلب دليفري — الحالة: ' || NEW.status,
        CASE NEW.status WHEN 'delivered' THEN 'success' WHEN 'cancelled' THEN 'error' ELSE 'info' END,
        '/merchant'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_delivery_request ON public.delivery_requests;
CREATE TRIGGER trg_notify_delivery_request
  AFTER UPDATE ON public.delivery_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_delivery_request_changes();

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_store_credentials_updated ON public.store_credentials;
CREATE TRIGGER trg_store_credentials_updated BEFORE UPDATE ON public.store_credentials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_delivery_personnel_updated ON public.delivery_personnel;
CREATE TRIGGER trg_delivery_personnel_updated BEFORE UPDATE ON public.delivery_personnel
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_delivery_requests_updated ON public.delivery_requests;
CREATE TRIGGER trg_delivery_requests_updated BEFORE UPDATE ON public.delivery_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
