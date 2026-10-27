DROP POLICY IF EXISTS profiles_read_all ON public.profiles;
DROP POLICY IF EXISTS profiles_update_all ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_all ON public.profiles;
DROP POLICY IF EXISTS analytics_read_all ON public.analytics_events;
DROP POLICY IF EXISTS analytics_insert_all ON public.analytics_events;
REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.analytics_events FROM anon, authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.analytics_events TO service_role;
