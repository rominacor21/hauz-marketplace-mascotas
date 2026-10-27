DROP POLICY IF EXISTS eventos_insert_any ON public.eventos;
REVOKE INSERT ON public.eventos FROM anon, authenticated;
