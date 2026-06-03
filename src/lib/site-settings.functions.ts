import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("site_name, tagline, logo_url, primary_color, contact_phone, contact_whatsapp, contact_email")
    .eq("id", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return {
    settings: data ?? {
      site_name: "آش مول",
      tagline: null,
      logo_url: null,
      primary_color: null,
      contact_phone: null,
      contact_whatsapp: null,
      contact_email: null,
    },
  };
});
