-- Revoke direct EXECUTE on internal trigger functions (they only need to run as triggers)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
-- has_role is intentionally callable; it's the canonical RLS helper.