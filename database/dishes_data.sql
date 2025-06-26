-- Hoppn Curated Dishes Data
-- These are authentic African dishes for the mobile app

-- Insert all Hoppn-curated dishes with their cultural information
INSERT INTO public.dishes (id, name, description, image_url, base_price, category, base_spice_level, country_origin, country_flag, origin_story, base_ingredients, is_vegetarian, is_vegan, calories, preparation_method, cultural_significance, health_benefits, native_regions, taste_profile) VALUES

-- Nigeria Dishes
('550e8400-e29b-41d4-a716-446655440101', 'Jollof Rice', 'Fragrant rice cooked in a rich tomato sauce with spices, served with grilled chicken', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 16.99, 'Main Course', 2, 'Nigeria', '🇳🇬', 'Jollof rice is a beloved West African dish with origins dating back to the 14th century in the Senegambian region. Each country has perfected its own version, with Nigerian Jollof being known for its bold flavors and party rice tradition.', ARRAY['Rice', 'Tomatoes', 'Onions', 'Bell peppers', 'Spices', 'Chicken stock'], false, false, 420, 'Rice is parboiled, then cooked in a rich tomato-based sauce with aromatic spices until perfectly tender and flavorful.', 'Jollof rice is the centerpiece of celebrations, family gatherings, and special occasions across West Africa, symbolizing unity and shared heritage.', 'Rich in carbohydrates for energy, contains lycopene from tomatoes, and provides essential vitamins from bell peppers and onions.', ARRAY['Lagos, Nigeria', 'Accra, Ghana', 'Dakar, Senegal', 'Freetown, Sierra Leone'], 'Savory and aromatic with a perfect balance of tomato richness, subtle heat from peppers, and fragrant spices that create a deeply satisfying flavor.'),

('550e8400-e29b-41d4-a716-446655440102', 'Suya', 'Grilled spiced beef skewers with yaji spice blend and fresh vegetables', 'https://images.pexels.com/photos/5474045/pexels-photo-5474045.jpeg', 14.99, 'Appetizer', 4, 'Nigeria', '🇳🇬', 'Suya originated with the Hausa people of Northern Nigeria and has become a beloved street food across West Africa. The yaji spice blend, made from groundnuts and spices, gives suya its distinctive flavor and has been perfected over centuries.', ARRAY['Beef', 'Groundnut powder', 'Chili pepper', 'Ginger', 'Garlic', 'Onions'], false, false, 220, 'Thin strips of beef are marinated in spices, skewered, and grilled over open flames, then coated with yaji spice blend.', 'Suya represents the social aspect of Nigerian culture, often enjoyed in groups during evening gatherings and celebrations.', 'High in protein, contains healthy fats from groundnuts, and spices provide anti-inflammatory properties.', ARRAY['Kano, Nigeria', 'Kaduna, Nigeria', 'Jos, Nigeria', 'Abuja, Nigeria'], 'Smoky and spicy with a nutty undertone from groundnut powder, balanced with aromatic spices that create an addictive flavor profile.'),

('550e8400-e29b-41d4-a716-446655440103', 'Egusi Soup', 'Nigerian soup made with ground melon seeds, leafy vegetables, and meat', 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg', 15.99, 'Main Course', 3, 'Nigeria', '🇳🇬', 'Egusi soup has been a cornerstone of Nigerian cuisine for centuries, particularly among the Yoruba people. The ground melon seeds create a rich, nutritious base that has sustained families for generations.', ARRAY['Ground melon seeds', 'Spinach', 'Beef', 'Fish', 'Palm oil', 'Onions'], false, false, 380, 'Ground melon seeds are cooked with palm oil, meat, fish, and leafy vegetables to create a thick, nutritious soup.', 'Egusi soup is a symbol of Nigerian hospitality and represents the country''s agricultural heritage and communal dining traditions.', 'Rich in protein from melon seeds, high in vitamins from leafy greens, and provides healthy fats from palm oil.', ARRAY['Lagos, Nigeria', 'Ibadan, Nigeria', 'Abeokuta, Nigeria', 'Ilorin, Nigeria'], 'Rich and hearty with a nutty flavor from melon seeds, complemented by the earthiness of leafy greens and the richness of palm oil.'),

-- Ghana Dishes
('550e8400-e29b-41d4-a716-446655440201', 'Fufu', 'Traditional pounded cassava and yam served with rich palm nut soup', 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg', 13.99, 'Main Course', 2, 'Ghana', '🇬🇭', 'Fufu has been a staple food in Ghana for over 1000 years, traditionally prepared by pounding boiled cassava and plantain in a wooden mortar. It represents the heart of Ghanaian cuisine and communal dining.', ARRAY['Cassava', 'Plantain', 'Palm nuts', 'Fish', 'Meat', 'Vegetables'], false, false, 380, 'Boiled cassava and plantain are pounded until smooth and elastic, served with soup made from palm nuts, meat, and vegetables.', 'Fufu eating is a communal activity that brings families together, representing unity and shared traditions in Ghanaian culture.', 'Rich in carbohydrates and fiber, provides essential vitamins from palm nuts, and offers complete proteins when served with meat or fish.', ARRAY['Kumasi, Ghana', 'Accra, Ghana', 'Cape Coast, Ghana', 'Tamale, Ghana'], 'Mild and starchy with a smooth, elastic texture that perfectly complements the rich, savory flavors of the accompanying soup.'),

('550e8400-e29b-41d4-a716-446655440202', 'Kelewele', 'Spiced fried plantains with ginger and pepper, served as a snack or side', 'https://images.pexels.com/photos/5940760/pexels-photo-5940760.jpeg', 8.99, 'Appetizer', 3, 'Ghana', '🇬🇭', 'Kelewele is a popular Ghanaian street food that originated in the northern regions. The combination of sweet plantains with fiery spices represents the perfect balance in Ghanaian cuisine - sweet, spicy, and deeply satisfying.', ARRAY['Ripe plantains', 'Ginger', 'Chili pepper', 'Onions', 'Salt'], true, true, 180, 'Ripe plantains are cubed, seasoned with ginger, chili, and spices, then deep-fried until golden and caramelized.', 'Kelewele is enjoyed as a popular street snack and represents the vibrant street food culture of Ghana.', 'Rich in potassium and vitamin C from plantains, ginger provides digestive benefits and anti-inflammatory properties.', ARRAY['Tamale, Ghana', 'Bolgatanga, Ghana', 'Wa, Ghana', 'Accra, Ghana'], 'Sweet and spicy with caramelized edges, the natural sweetness of plantains balanced by the heat of ginger and chili peppers.'),

-- Senegal Dishes
('550e8400-e29b-41d4-a716-446655440301', 'Thieboudienne', 'Senegalese national dish of fish and rice with vegetables in tomato sauce', 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg', 19.99, 'Main Course', 2, 'Senegal', '🇸🇳', 'Thieboudienne, meaning "rice and fish" in Wolof, was created in the 19th century in Saint-Louis, Senegal. It has become the national dish and represents the essence of Senegalese cuisine and hospitality.', ARRAY['Fish', 'Rice', 'Tomatoes', 'Onions', 'Cabbage', 'Carrots', 'Okra'], false, false, 450, 'Fish is stuffed with herbs and fried, then cooked with vegetables in tomato sauce. Rice is cooked in the flavorful broth.', 'Thieboudienne is the centerpiece of Senegalese family meals and represents the country''s rich fishing heritage and communal dining traditions.', 'High in omega-3 fatty acids from fish, rich in vitamins from vegetables, and provides complex carbohydrates from rice.', ARRAY['Saint-Louis, Senegal', 'Dakar, Senegal', 'Thiès, Senegal', 'Kaolack, Senegal'], 'Rich and savory with layers of flavor from the fish broth, sweet vegetables, and aromatic spices creating a harmonious and satisfying meal.'),

('550e8400-e29b-41d4-a716-446655440302', 'Yassa', 'Senegalese lemon-marinated chicken with caramelized onions and mustard', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 18.99, 'Main Course', 2, 'Senegal', '🇸🇳', 'Yassa originated in the Casamance region of Senegal and reflects the country''s French colonial influence combined with traditional West African cooking methods.', ARRAY['Chicken', 'Lemons', 'Onions', 'Mustard', 'Garlic', 'Bay leaves'], false, false, 350, 'Chicken is marinated in lemon juice and spices, then grilled and served with caramelized onions in a tangy sauce.', 'Yassa represents the fusion of cultures in Senegal and is often served at special occasions and family gatherings.', 'High in protein from chicken, vitamin C from lemons, and antioxidants from onions and garlic.', ARRAY['Ziguinchor, Senegal', 'Dakar, Senegal', 'Thiès, Senegal', 'Kaolack, Senegal'], 'Tangy and aromatic with the brightness of lemon, the sweetness of caramelized onions, and the depth of grilled chicken creating a perfect balance of flavors.'),

-- Ethiopia Dishes
('550e8400-e29b-41d4-a716-446655440401', 'Doro Wat', 'Traditional Ethiopian chicken stew with berbere spice blend, served with injera', 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg', 18.99, 'Main Course', 4, 'Ethiopia', '🇪🇹', 'Doro Wat is Ethiopia''s national dish, traditionally served during special occasions and holidays. The complex berbere spice blend can contain up to 20 different spices, creating layers of flavor that represent the heart of Ethiopian cuisine.', ARRAY['Chicken', 'Berbere spice', 'Onions', 'Garlic', 'Ginger', 'Hard-boiled eggs'], false, false, 380, 'Chicken is slow-cooked in a rich sauce made with berbere spice, onions, and aromatic spices until tender and flavorful.', 'Doro Wat is the centerpiece of Ethiopian celebrations and represents the country''s ancient culinary traditions and communal dining culture.', 'Rich in protein from chicken and eggs, berbere spices provide antioxidants and anti-inflammatory compounds.', ARRAY['Addis Ababa, Ethiopia', 'Gondar, Ethiopia', 'Bahir Dar, Ethiopia', 'Dire Dawa, Ethiopia'], 'Complex and deeply spiced with layers of heat and flavor from berbere, balanced by the richness of slow-cooked chicken and aromatic vegetables.'),

('550e8400-e29b-41d4-a716-446655440402', 'Injera', 'Traditional Ethiopian sourdough flatbread with a spongy texture', 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg', 4.99, 'Bread', 1, 'Ethiopia', '🇪🇹', 'Injera has been the foundation of Ethiopian cuisine for over 3,000 years. Made from teff, an ancient grain native to Ethiopia, it serves as both plate and utensil in traditional dining, symbolizing community and shared meals.', ARRAY['Teff flour', 'Water'], true, true, 85, 'Teff flour is fermented for several days to create a sourdough starter, then cooked on a clay plate called mitad.', 'Injera represents the foundation of Ethiopian culture, used as both food and eating utensil, symbolizing unity and shared heritage.', 'Teff is rich in protein, fiber, and minerals including iron and calcium, and is naturally gluten-free.', ARRAY['Tigray, Ethiopia', 'Amhara, Ethiopia', 'Oromia, Ethiopia', 'SNNPR, Ethiopia'], 'Mildly tangy and sour from fermentation with a unique spongy texture that perfectly absorbs the flavors of accompanying dishes.'),

-- Somalia Dishes
('550e8400-e29b-41d4-a716-446655440501', 'Beef Suqaar', 'Somali spiced beef stir-fry with onions, peppers, and aromatic spices', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 17.99, 'Main Course', 3, 'Somalia', '🇸🇴', 'Suqaar reflects Somalia''s position as a trading hub, incorporating spices from Arab and Indian merchants. This quick-cooking method preserves the meat''s tenderness while infusing it with aromatic spices.', ARRAY['Beef', 'Onions', 'Bell peppers', 'Cumin', 'Coriander', 'Cardamom'], false, false, 320, 'Tender beef is cut into small cubes and quickly stir-fried with onions, peppers, and a blend of aromatic spices.', 'Suqaar represents the nomadic heritage of Somalia, where quick-cooking methods were essential for pastoral life.', 'High in protein and iron from beef, spices provide antioxidants and digestive benefits.', ARRAY['Mogadishu, Somalia', 'Hargeisa, Somalia', 'Bosaso, Somalia', 'Kismayo, Somalia'], 'Tender and aromatic with warm spices, the beef remains juicy while absorbing the complex flavors of cumin, coriander, and cardamom.'),

-- Kenya Dishes
('550e8400-e29b-41d4-a716-446655440601', 'Ugali', 'Kenyan cornmeal staple served with sukuma wiki and nyama choma', 'https://images.pexels.com/photos/5940760/pexels-photo-5940760.jpeg', 11.99, 'Main Course', 1, 'Kenya', '🇰🇪', 'Ugali became a staple food in Kenya during the colonial period when maize was introduced. It has since become the foundation of Kenyan cuisine, representing sustenance and community.', ARRAY['White cornmeal', 'Water', 'Salt'], true, true, 180, 'Cornmeal is gradually added to boiling water while stirring continuously until it forms a thick, smooth consistency.', 'Ugali is the foundation of Kenyan meals, representing unity and shared heritage across different ethnic groups.', 'Provides complex carbohydrates for sustained energy and is naturally gluten-free.', ARRAY['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'], 'Mild and neutral with a firm, smooth texture that serves as the perfect base for absorbing flavors from accompanying dishes.'),

-- Morocco Dishes
('550e8400-e29b-41d4-a716-446655440701', 'Tagine', 'Slow-cooked Moroccan lamb with apricots, almonds, and aromatic spices', 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg', 22.99, 'Main Course', 2, 'Morocco', '🇲🇦', 'The tagine cooking method dates back to the 9th century in Morocco. The conical clay pot allows steam to circulate and condense, creating tender, flavorful dishes that represent the essence of Moroccan cuisine.', ARRAY['Lamb', 'Dried apricots', 'Almonds', 'Onions', 'Cinnamon', 'Ginger'], false, false, 420, 'Lamb is slow-cooked in a traditional tagine pot with fruits, nuts, and spices, allowing flavors to meld and intensify.', 'Tagine represents the heart of Moroccan hospitality and the country''s rich Berber and Arab culinary heritage.', 'Rich in protein from lamb, antioxidants from spices, and healthy fats from almonds.', ARRAY['Marrakech, Morocco', 'Fez, Morocco', 'Casablanca, Morocco', 'Rabat, Morocco'], 'Sweet and savory with tender lamb, the natural sweetness of apricots balanced by warm spices and the crunch of almonds.')

ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    base_price = EXCLUDED.base_price,
    category = EXCLUDED.category,
    base_spice_level = EXCLUDED.base_spice_level,
    country_origin = EXCLUDED.country_origin,
    country_flag = EXCLUDED.country_flag,
    origin_story = EXCLUDED.origin_story,
    base_ingredients = EXCLUDED.base_ingredients,
    is_vegetarian = EXCLUDED.is_vegetarian,
    is_vegan = EXCLUDED.is_vegan,
    calories = EXCLUDED.calories,
    preparation_method = EXCLUDED.preparation_method,
    cultural_significance = EXCLUDED.cultural_significance,
    health_benefits = EXCLUDED.health_benefits,
    native_regions = EXCLUDED.native_regions,
    taste_profile = EXCLUDED.taste_profile,
    updated_at = NOW();

-- Create a simple function to get dishes by country (no countries table dependency)
CREATE OR REPLACE FUNCTION get_dishes_by_country(country_name TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    base_price DECIMAL(10,2),
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
        d.id,
        d.name,
        d.description,
        d.image_url,
        d.base_price,
        d.category,
        d.base_spice_level,
        d.country_origin,
        d.country_flag,
        d.origin_story,
        d.base_ingredients,
        d.is_vegetarian,
        d.is_vegan,
        d.calories,
        d.preparation_method,
        d.cultural_significance,
        d.health_benefits,
        d.native_regions,
        d.taste_profile
    FROM public.dishes d
    WHERE d.country_origin = country_name 
    AND d.is_active = true
    ORDER BY d.name;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get featured dishes (first 4 available dishes)
CREATE OR REPLACE FUNCTION get_featured_dishes()
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    base_price DECIMAL(10,2),
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
        d.id,
        d.name,
        d.description,
        d.image_url,
        d.base_price,
        d.category,
        d.base_spice_level,
        d.country_origin,
        d.country_flag,
        d.origin_story,
        d.base_ingredients,
        d.is_vegetarian,
        d.is_vegan,
        d.calories,
        d.preparation_method,
        d.cultural_significance,
        d.health_benefits,
        d.native_regions,
        d.taste_profile
    FROM public.dishes d
    WHERE d.is_active = true
    ORDER BY d.created_at DESC
    LIMIT 4;
END;
$$ LANGUAGE plpgsql; 