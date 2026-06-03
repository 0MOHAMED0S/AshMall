
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_delivery_user(uuid) FROM anon, authenticated, public;
-- إعادة كل الباقي لـ service_role فقط (الدوال شغالة جوّا RLS بصلاحية المالك)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_delivery_user(uuid) TO service_role;
