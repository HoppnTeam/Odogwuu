-- Countries Data for Hoppn
-- This creates a dedicated countries table and populates it with the countries shown in the "Explore by Country" section

-- Create countries table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.countries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    flag TEXT NOT NULL,
    description TEXT NOT NULL,
    region TEXT NOT NULL, -- Changed from cuisine_region to TEXT for simplicity
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_countries_name ON public.countries(name);
CREATE INDEX IF NOT EXISTS idx_countries_region ON public.countries(region);
CREATE INDEX IF NOT EXISTS idx_countries_is_active ON public.countries(is_active);

-- Enable RLS on countries table
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for countries (public read access)
CREATE POLICY "Anyone can view active countries" ON public.countries
    FOR SELECT USING (is_active = true);

-- Note: Removed the trigger dependency to keep this script independent
-- The updated_at column will be updated manually when needed

-- Insert the countries data from the "Explore by Country" section
INSERT INTO public.countries (name, flag, description, region, display_order) VALUES
('Nigeria', '🇳🇬', 'Home to diverse cuisines including Yoruba, Igbo, and Hausa traditions', 'West African', 1),
('Ghana', '🇬🇭', 'Known for rich stews, grilled meats, and flavorful spice blends', 'West African', 2),
('Liberia', '🇱🇷', 'Unique blend of African and American influences in traditional cooking', 'West African', 3),
('Kenya', '🇰🇪', 'East African cuisine with Indian and Arab influences', 'East African', 4),
('Somalia', '🇸🇴', 'Horn of Africa flavors with Italian and Arab culinary influences', 'East African', 5),
('Ethiopia', '🇪🇹', 'Famous for injera bread and complex spice blends like berbere', 'East African', 6),
('Gambia', '🇬🇲', 'West African coastal cuisine with rice-based dishes and fresh seafood', 'West African', 7),
('Senegal', '🇸🇳', 'Renowned for thieboudienne and vibrant Wolof culinary traditions', 'West African', 8),
('Sudan', '🇸🇩', 'North African cuisine blending Arab, African, and Mediterranean influences', 'North African', 9),
('Morocco', '🇲🇦', 'North African cuisine with Berber, Arab, and Mediterranean influences', 'North African', 10),
('Togo', '🇹🇬', 'West African flavors with French colonial culinary influences', 'West African', 11),
('Sierra Leone', '🇸🇱', 'West African coastal cuisine with unique rice dishes and palm oil cooking', 'West African', 12)
ON CONFLICT (name) DO UPDATE SET
    flag = EXCLUDED.flag,
    description = EXCLUDED.description,
    region = EXCLUDED.region,
    display_order = EXCLUDED.display_order,
    updated_at = NOW();

-- Create a view for countries with dish counts
CREATE OR REPLACE VIEW public.countries_with_dish_counts AS
SELECT 
    c.id,
    c.name,
    c.flag,
    c.description,
    c.region,
    c.display_order,
    COUNT(d.id) as dish_count
FROM public.countries c
LEFT JOIN public.dishes d ON c.name = d.country_origin AND d.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.flag, c.description, c.region, c.display_order
ORDER BY c.display_order, c.name;

-- Create a function to get countries for the Discovery screen
CREATE OR REPLACE FUNCTION get_countries_for_discovery()
RETURNS TABLE (
    name TEXT,
    flag TEXT,
    description TEXT,
    region TEXT, -- Changed from cuisine_region to TEXT
    dish_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.name,
        c.flag,
        c.description,
        c.region,
        COUNT(d.id) as dish_count
    FROM public.countries c
    LEFT JOIN public.dishes d ON c.name = d.country_origin AND d.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.flag, c.description, c.region, c.display_order
    ORDER BY c.display_order, c.name;
END;
$$ LANGUAGE plpgsql; 