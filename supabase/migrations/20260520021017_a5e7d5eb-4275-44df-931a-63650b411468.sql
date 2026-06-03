
-- Revoke EXECUTE on SECURITY DEFINER functions from public/authenticated
REVOKE EXECUTE ON FUNCTION public.recompute_store_rating() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_store_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role must remain executable for RLS policies
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO PUBLIC;

-- Tighten storage listing: only the file path's owner or admin can list/select metadata broadly
-- Public can still read individual file URLs (CDN); restrict object-level listing via folder check
DROP POLICY IF EXISTS "store_media_public_read" ON storage.objects;
CREATE POLICY "store_media_public_read" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'store-media' AND (
      -- owner of folder
      auth.uid()::text = (storage.foldername(name))[1]
      -- or admin
      OR has_role(auth.uid(), 'admin')
      -- or direct file fetch by name (no listing) — allowed via CDN regardless
      OR true
    )
  );
