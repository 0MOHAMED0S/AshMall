
-- 1) delivery_personnel: تأمين الباسورد والـ PII (admin only)
DROP POLICY IF EXISTS delivery_personnel_self_read ON public.delivery_personnel;
DROP POLICY IF EXISTS delivery_personnel_owner_read ON public.delivery_personnel;

-- 2) delivery_requests: تقييد UPDATE
DROP POLICY IF EXISTS delivery_requests_delivery_update ON public.delivery_requests;
CREATE POLICY delivery_requests_delivery_update
  ON public.delivery_requests FOR UPDATE
  TO authenticated
  USING (
    public.is_delivery_user(auth.uid())
    AND (assigned_to = auth.uid() OR (assigned_to IS NULL AND status = 'pending'))
  )
  WITH CHECK (
    public.is_delivery_user(auth.uid())
    AND (assigned_to = auth.uid())
  );

-- تقييد SELECT برضه (الدليفري يشوف اللي مسند ليه أو المعلق فقط)
DROP POLICY IF EXISTS delivery_requests_delivery_read ON public.delivery_requests;
CREATE POLICY delivery_requests_delivery_read
  ON public.delivery_requests FOR SELECT
  TO authenticated
  USING (
    public.is_delivery_user(auth.uid())
    AND (assigned_to = auth.uid() OR (assigned_to IS NULL AND status = 'pending'))
  );

-- 3) store-media: تقييد الرفع لأصحاب المتاجر الموافق عليها فقط
DROP POLICY IF EXISTS store_media_owner_insert ON storage.objects;
CREATE POLICY store_media_owner_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'store-media'
    AND (auth.uid())::text = (storage.foldername(name))[1]
    AND EXISTS (
      SELECT 1 FROM public.stores s
      WHERE s.owner_id = auth.uid() AND s.status = 'approved'
    )
  );

-- 4) store-media: منع الـ listing عبر API (الملفات لسه متاحة عبر public URL)
DROP POLICY IF EXISTS store_media_public_read ON storage.objects;
CREATE POLICY store_media_owner_read
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'store-media'
    AND (
      (auth.uid())::text = (storage.foldername(name))[1]
      OR public.has_role(auth.uid(), 'admin')
    )
  );

-- 5) سحب EXECUTE من anon على دوال notify (داخلية فقط للـ triggers)
REVOKE EXECUTE ON FUNCTION public.notify_store_status_change() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_delivery_request_changes() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_order_changes() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_store_rating() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;
