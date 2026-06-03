-- Add compare_at_price for discount display, and order_count for popularity sorting
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_at_price numeric,
  ADD COLUMN IF NOT EXISTS order_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url_extra text;

CREATE INDEX IF NOT EXISTS idx_products_order_count ON public.products (order_count DESC);
CREATE INDEX IF NOT EXISTS idx_products_compare_price ON public.products (compare_at_price) WHERE compare_at_price IS NOT NULL;