INSERT INTO public.categories (slug, name_ar, name_en, icon, sort_order) VALUES
('supermarket', 'سوبر ماركت', 'Supermarket', 'ShoppingCart', 9),
('home-goods', 'أدوات منزلية', 'Home Goods', 'Home', 10),
('donate', 'تبرع', 'Donate', 'HeartHandshake', 11),
('bekia', 'بيكيا أشمون', 'Bekia Ashmoun', 'Recycle', 12)
ON CONFLICT (slug) DO NOTHING;