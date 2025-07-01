-- Migration: Create Hoppn Dishes Table and Move Platform Dishes
-- This creates a dedicated table for Hoppn-curated platform dishes
-- and moves the 12 existing dishes from the dishes table

-- Step 1: Create hoppn_dishes table (same structure as dishes but without vendor-specific fields)
CREATE TABLE IF NOT EXISTS public.hoppn_dishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    base_spice_level INTEGER NOT NULL CHECK (base_spice_level >= 1 AND base_spice_level <= 5),
    country_origin TEXT NOT NULL,
    country_flag TEXT NOT NULL,
    origin_story TEXT NOT NULL,
    base_ingredients TEXT[] NOT NULL,
    is_vegetarian BOOLEAN NOT NULL DEFAULT false,
    is_vegan BOOLEAN NOT NULL DEFAULT false,
    calories INTEGER,
    preparation_method TEXT,
    cultural_significance TEXT,
    health_benefits TEXT,
    native_regions TEXT[],
    taste_profile TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hoppn_dishes_country_origin ON public.hoppn_dishes(country_origin);
CREATE INDEX IF NOT EXISTS idx_hoppn_dishes_category ON public.hoppn_dishes(category);
CREATE INDEX IF NOT EXISTS idx_hoppn_dishes_base_spice_level ON public.hoppn_dishes(base_spice_level);
CREATE INDEX IF NOT EXISTS idx_hoppn_dishes_is_active ON public.hoppn_dishes(is_active);

-- Step 3: Move the 12 Hoppn-curated dishes from dishes table to hoppn_dishes table
INSERT INTO public.hoppn_dishes (
    id,
    name,
    description,
    image_url,
    category,
    base_spice_level,
    country_origin,
    country_flag,
    origin_story,
    base_ingredients,
    is_vegetarian,
    is_vegan,
    calories,
    preparation_method,
    cultural_significance,
    health_benefits,
    native_regions,
    taste_profile,
    is_active,
    created_at,
    updated_at
)
SELECT 
    id,
    name,
    description,
    image_url,
    category,
    base_spice_level,
    country_origin,
    country_flag,
    origin_story,
    base_ingredients,
    is_vegetarian,
    is_vegan,
    calories,
    preparation_method,
    cultural_significance,
    health_benefits,
    native_regions,
    taste_profile,
    is_active,
    created_at,
    updated_at
FROM public.dishes
WHERE id IN (
    -- Nigeria Dishes
    '550e8400-e29b-41d4-a716-446655440101', -- Jollof Rice
    '550e8400-e29b-41d4-a716-446655440102', -- Suya
    '550e8400-e29b-41d4-a716-446655440103', -- Egusi Soup
    '550e8400-e29b-41d4-a716-446655440104', -- Egusi Soup (additional)
    
    -- Ghana Dishes
    '550e8400-e29b-41d4-a716-446655440201', -- Fufu
    '550e8400-e29b-41d4-a716-446655440202', -- Kelewele
    
    -- Senegal Dishes
    '550e8400-e29b-41d4-a716-446655440301', -- Thieboudienne
    '550e8400-e29b-41d4-a716-446655440302', -- Yassa
    '550e8400-e29b-41d4-a716-446655440303', -- Yassa (additional)
    
    -- Ethiopia Dishes
    '550e8400-e29b-41d4-a716-446655440401', -- Doro Wat
    '550e8400-e29b-41d4-a716-446655440402', -- Injera
    '550e8400-e29b-41d4-a716-446655440403', -- Injera (additional)
    
    -- Somalia Dishes
    '550e8400-e29b-41d4-a716-446655440501', -- Beef Suqaar
    '550e8400-e29b-41d4-a716-446655440502', -- Beef Suqaar (additional)
    
    -- Kenya Dishes
    '550e8400-e29b-41d4-a716-446655440601', -- Ugali
    '550e8400-e29b-41d4-a716-446655440602', -- Ugali (additional)
    
    -- Morocco Dishes
    '550e8400-e29b-41d4-a716-446655440701', -- Tagine
    '550e8400-e29b-41d4-a716-446655440702'  -- Tagine (additional)
);

-- Step 4: Add hoppn_dish_id column to dishes table for linking
ALTER TABLE public.dishes 
ADD COLUMN IF NOT EXISTS hoppn_dish_id UUID REFERENCES public.hoppn_dishes(id);

-- Step 5: Create index for the foreign key relationship
CREATE INDEX IF NOT EXISTS idx_dishes_hoppn_dish_id ON public.dishes(hoppn_dish_id);

-- Step 6: Remove the moved dishes from the dishes table (they're now platform dishes)
DELETE FROM public.dishes 
WHERE id IN (
    '550e8400-e29b-41d4-a716-446655440101', -- Jollof Rice
    '550e8400-e29b-41d4-a716-446655440102', -- Suya
    '550e8400-e29b-41d4-a716-446655440103', -- Egusi Soup
    '550e8400-e29b-41d4-a716-446655440104', -- Egusi Soup (additional)
    '550e8400-e29b-41d4-a716-446655440201', -- Fufu
    '550e8400-e29b-41d4-a716-446655440202', -- Kelewele
    '550e8400-e29b-41d4-a716-446655440301', -- Thieboudienne
    '550e8400-e29b-41d4-a716-446655440302', -- Yassa
    '550e8400-e29b-41d4-a716-446655440303', -- Yassa (additional)
    '550e8400-e29b-41d4-a716-446655440401', -- Doro Wat
    '550e8400-e29b-41d4-a716-446655440402', -- Injera
    '550e8400-e29b-41d4-a716-446655440403', -- Injera (additional)
    '550e8400-e29b-41d4-a716-446655440501', -- Beef Suqaar
    '550e8400-e29b-41d4-a716-446655440502', -- Beef Suqaar (additional)
    '550e8400-e29b-41d4-a716-446655440601', -- Ugali
    '550e8400-e29b-41d4-a716-446655440602', -- Ugali (additional)
    '550e8400-e29b-41d4-a716-446655440701', -- Tagine
    '550e8400-e29b-41d4-a716-446655440702'  -- Tagine (additional)
);

-- Step 7: Create function to get Hoppn dishes by country
CREATE OR REPLACE FUNCTION get_hoppn_dishes_by_country(country_name TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    category TEXT,
    base_spice_level INTEGER,
    country_origin TEXT,
    country_flag TEXT,
    origin_story TEXT,
    base_ingredients TEXT[],
    is_vegetarian BOOLEAN,
    is_vegan BOOLEAN,
    calories INTEGER,
    preparation_method TEXT,
    cultural_significance TEXT,
    health_benefits TEXT,
    native_regions TEXT[],
    taste_profile TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hd.id,
        hd.name,
        hd.description,
        hd.image_url,
        hd.category,
        hd.base_spice_level,
        hd.country_origin,
        hd.country_flag,
        hd.origin_story,
        hd.base_ingredients,
        hd.is_vegetarian,
        hd.is_vegan,
        hd.calories,
        hd.preparation_method,
        hd.cultural_significance,
        hd.health_benefits,
        hd.native_regions,
        hd.taste_profile
    FROM public.hoppn_dishes hd
    WHERE hd.country_origin = country_name 
    AND hd.is_active = true
    ORDER BY hd.name;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create function to get all Hoppn dishes
CREATE OR REPLACE FUNCTION get_all_hoppn_dishes()
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    category TEXT,
    base_spice_level INTEGER,
    country_origin TEXT,
    country_flag TEXT,
    origin_story TEXT,
    base_ingredients TEXT[],
    is_vegetarian BOOLEAN,
    is_vegan BOOLEAN,
    calories INTEGER,
    preparation_method TEXT,
    cultural_significance TEXT,
    health_benefits TEXT,
    native_regions TEXT[],
    taste_profile TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hd.id,
        hd.name,
        hd.description,
        hd.image_url,
        hd.category,
        hd.base_spice_level,
        hd.country_origin,
        hd.country_flag,
        hd.origin_story,
        hd.base_ingredients,
        hd.is_vegetarian,
        hd.is_vegan,
        hd.calories,
        hd.preparation_method,
        hd.cultural_significance,
        hd.health_benefits,
        hd.native_regions,
        hd.taste_profile
    FROM public.hoppn_dishes hd
    WHERE hd.is_active = true
    ORDER BY hd.country_origin, hd.name;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Verify the migration
SELECT 
    'Hoppn Dishes Count' as table_name,
    COUNT(*) as count
FROM public.hoppn_dishes
WHERE is_active = true

UNION ALL

SELECT 
    'Vendor Dishes Count' as table_name,
    COUNT(*) as count
FROM public.dishes
WHERE is_active = true;

-- Step 10: Show sample of moved dishes
SELECT 
    'Moved to Hoppn Dishes' as status,
    name,
    country_origin,
    category
FROM public.hoppn_dishes
ORDER BY country_origin, name; 