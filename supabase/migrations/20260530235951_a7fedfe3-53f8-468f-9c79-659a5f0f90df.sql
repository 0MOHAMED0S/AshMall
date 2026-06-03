CREATE TABLE public.site_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  site_name TEXT NOT NULL DEFAULT 'آش مول',
  tagline TEXT,
  logo_url TEXT,
  primary_color TEXT,
  contact_phone TEXT,
  contact_whatsapp TEXT,
  contact_email TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = true)
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_settings_public_read ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY site_settings_admin_write ON public.site_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (id, site_name, tagline)
  VALUES (true, 'آش مول', 'دليلك للمحلات والخدمات في أشمون')
  ON CONFLICT (id) DO NOTHING;