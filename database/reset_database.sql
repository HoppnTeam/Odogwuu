-- Hoppn Database Reset Script
-- This script will safely drop existing tables and recreate them
-- Run this if you get "relation already exists" errors

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.dishes CASCADE;
DROP TABLE IF EXISTS public.vendors CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.countries CASCADE;

-- Drop existing functions and views
DROP FUNCTION IF EXISTS get_dishes_by_country(TEXT);
DROP FUNCTION IF EXISTS get_featured_dishes();
DROP FUNCTION IF EXISTS calculate_vendor_rating(UUID);
DROP FUNCTION IF EXISTS get_nearby_vendors(DECIMAL, DECIMAL, INTEGER);
DROP FUNCTION IF EXISTS calculate_mn_tax(DECIMAL, TEXT);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop existing views
DROP VIEW IF EXISTS public.dishes_by_country;
DROP VIEW IF EXISTS public.countries_with_dish_counts;

-- Drop existing types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS cuisine_region CASCADE;

-- Now run the schema.sql file to recreate everything
-- Copy and paste the contents of schema.sql here, or run it separately

-- After running schema.sql, run:
-- 1. countries_data.sql
-- 2. dishes_data.sql

-- Verification queries:
-- SELECT * FROM countries WHERE is_active = true ORDER BY display_order;
-- SELECT * FROM dishes WHERE is_active = true ORDER BY country_origin, name; 