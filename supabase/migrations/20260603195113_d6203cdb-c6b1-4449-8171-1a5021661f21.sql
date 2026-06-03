
-- 1) Remove overly broad delivery_personnel read policy (exposed password column to all store owners)
DROP POLICY IF EXISTS "delivery_personnel_owner_read" ON public.delivery_personnel;

-- 2) Fix store-media bucket insert: restrict to the user's own folder
DROP POLICY IF EXISTS "store_media_owner_insert" ON storage.objects;
CREATE POLICY "store_media_owner_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'store-media'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 3) Realtime channel authorization on realtime.messages
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "realtime_notifications_self_only" ON realtime.messages;
DROP POLICY IF EXISTS "realtime_delivery_requests_authorized" ON realtime.messages;

-- Users can subscribe only to their own notification topic
CREATE POLICY "realtime_notifications_self_only"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() LIKE 'notifications:%' AND realtime.topic() = 'notifications:' || (auth.uid())::text)
  OR realtime.topic() NOT LIKE 'notifications:%'
);

-- Delivery requests channel: only store owners, delivery personnel, or admins
CREATE POLICY "realtime_delivery_requests_authorized"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() NOT LIKE 'delivery_requests%'
  OR EXISTS (SELECT 1 FROM public.stores s WHERE s.owner_id = auth.uid())
  OR public.is_delivery_user(auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);
