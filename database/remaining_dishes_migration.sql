-- Migration: Insert Remaining 6 Dishes (UUIDs 7-12)
-- This migration adds the final 6 dishes from the mock data to complete the dishes table

INSERT INTO public.dishes (id, name, description, image_url, base_price, category, base_spice_level, country_origin, country_flag, origin_story, base_ingredients, is_vegetarian, is_vegan, calories, preparation_method, cultural_significance, health_benefits, native_regions, taste_profile) VALUES

-- Ethiopia Dishes
('550e8400-e29b-41d4-a716-446655440403', 'Injera', 'Traditional Ethiopian sourdough flatbread with a spongy texture', 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg', 4.99, 'Bread', 1, 'Ethiopia', '🇪🇹', 'Injera has been the foundation of Ethiopian cuisine for over 3,000 years. Made from teff, an ancient grain native to Ethiopia, it serves as both plate and utensil in traditional dining, symbolizing community and shared meals.', ARRAY['Teff flour', 'Water'], true, true, 85, 'Teff flour is fermented for several days to create a sourdough starter, then cooked on a clay plate called mitad.', 'Injera represents the foundation of Ethiopian culture, used as both food and eating utensil, symbolizing unity and shared heritage.', 'Teff is rich in protein, fiber, and minerals including iron and calcium, and is naturally gluten-free.', ARRAY['Tigray, Ethiopia', 'Amhara, Ethiopia', 'Oromia, Ethiopia', 'SNNPR, Ethiopia'], 'Mildly tangy and sour from fermentation with a unique spongy texture that perfectly absorbs the flavors of accompanying dishes.'),

-- Somalia Dishes  
('550e8400-e29b-41d4-a716-446655440502', 'Beef Suqaar', 'Somali spiced beef stir-fry with onions, peppers, and aromatic spices', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 17.99, 'Main Course', 3, 'Somalia', '🇸🇴', 'Suqaar reflects Somalia''s position as a trading hub, incorporating spices from Arab and Indian merchants. This quick-cooking method preserves the meat''s tenderness while infusing it with aromatic spices.', ARRAY['Beef', 'Onions', 'Bell peppers', 'Cumin', 'Coriander', 'Cardamom'], false, false, 320, 'Tender beef is cut into small cubes and quickly stir-fried with onions, peppers, and a blend of aromatic spices.', 'Suqaar represents the nomadic heritage of Somalia, where quick-cooking methods were essential for pastoral life.', 'High in protein and iron from beef, spices provide antioxidants and digestive benefits.', ARRAY['Mogadishu, Somalia', 'Hargeisa, Somalia', 'Bosaso, Somalia', 'Kismayo, Somalia'], 'Tender and aromatic with warm spices, the beef remains juicy while absorbing the complex flavors of cumin, coriander, and cardamom.'),

-- Kenya Dishes
('550e8400-e29b-41d4-a716-446655440602', 'Ugali', 'Kenyan cornmeal staple served with sukuma wiki and nyama choma', 'https://images.pexels.com/photos/5940760/pexels-photo-5940760.jpeg', 11.99, 'Main Course', 1, 'Kenya', '🇰🇪', 'Ugali became a staple food in Kenya during the colonial period when maize was introduced. It has since become the foundation of Kenyan cuisine, representing sustenance and community.', ARRAY['White cornmeal', 'Water', 'Salt'], true, true, 180, 'Cornmeal is gradually added to boiling water while stirring continuously until it forms a thick, smooth consistency.', 'Ugali is the foundation of Kenyan meals, representing unity and shared heritage across different ethnic groups.', 'Provides complex carbohydrates for sustained energy and is naturally gluten-free.', ARRAY['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'], 'Mild and neutral with a firm, smooth texture that serves as the perfect base for absorbing flavors from accompanying dishes.'),

-- Morocco Dishes
('550e8400-e29b-41d4-a716-446655440702', 'Tagine', 'Slow-cooked Moroccan lamb with apricots, almonds, and aromatic spices', 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg', 22.99, 'Main Course', 2, 'Morocco', '🇲🇦', 'The tagine cooking method dates back to the 9th century in Morocco. The conical clay pot allows steam to circulate and condense, creating tender, flavorful dishes that represent the essence of Moroccan cuisine.', ARRAY['Lamb', 'Dried apricots', 'Almonds', 'Onions', 'Cinnamon', 'Ginger'], false, false, 420, 'Lamb is slow-cooked in a traditional tagine pot with fruits, nuts, and spices, allowing flavors to meld and intensify.', 'Tagine represents the heart of Moroccan hospitality and the country''s rich Berber and Arab culinary heritage.', 'Rich in protein from lamb, antioxidants from spices, and healthy fats from almonds.', ARRAY['Marrakech, Morocco', 'Fez, Morocco', 'Casablanca, Morocco', 'Rabat, Morocco'], 'Sweet and savory with tender lamb, the natural sweetness of apricots balanced by warm spices and the crunch of almonds.'),

-- Nigeria Dishes (additional)
('550e8400-e29b-41d4-a716-446655440104', 'Egusi Soup', 'Nigerian soup made with ground melon seeds, leafy vegetables, and meat', 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg', 15.99, 'Main Course', 3, 'Nigeria', '🇳🇬', 'Egusi soup has been a cornerstone of Nigerian cuisine for centuries, particularly among the Yoruba people. The ground melon seeds create a rich, nutritious base that has sustained families for generations.', ARRAY['Ground melon seeds', 'Spinach', 'Beef', 'Fish', 'Palm oil', 'Onions'], false, false, 380, 'Ground melon seeds are cooked with palm oil, meat, fish, and leafy vegetables to create a thick, nutritious soup.', 'Egusi soup is a symbol of Nigerian hospitality and represents the country''s agricultural heritage and communal dining traditions.', 'Rich in protein from melon seeds, high in vitamins from leafy greens, and provides healthy fats from palm oil.', ARRAY['Lagos, Nigeria', 'Ibadan, Nigeria', 'Abeokuta, Nigeria', 'Ilorin, Nigeria'], 'Rich and hearty with a nutty flavor from melon seeds, complemented by the earthiness of leafy greens and the richness of palm oil.'),

-- Senegal Dishes (additional)
('550e8400-e29b-41d4-a716-446655440303', 'Yassa', 'Senegalese lemon-marinated chicken with caramelized onions and mustard', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 18.99, 'Main Course', 2, 'Senegal', '🇸🇳', 'Yassa originated in the Casamance region of Senegal and reflects the country''s French colonial influence combined with traditional West African cooking methods.', ARRAY['Chicken', 'Lemons', 'Onions', 'Mustard', 'Garlic', 'Bay leaves'], false, false, 350, 'Chicken is marinated in lemon juice and spices, then grilled and served with caramelized onions in a tangy sauce.', 'Yassa represents the fusion of cultures in Senegal and is often served at special occasions and family gatherings.', 'High in protein from chicken, vitamin C from lemons, and antioxidants from onions and garlic.', ARRAY['Ziguinchor, Senegal', 'Dakar, Senegal', 'Thiès, Senegal', 'Kaolack, Senegal'], 'Tangy and savory with bright citrus notes from lemon, balanced by sweet caramelized onions and aromatic spices.')

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

-- Verify the migration
SELECT 
  id, 
  name, 
  country_origin, 
  base_price, 
  category,
  is_active
FROM dishes 
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440403',
  '550e8400-e29b-41d4-a716-446655440502', 
  '550e8400-e29b-41d4-a716-446655440602',
  '550e8400-e29b-41d4-a716-446655440702',
  '550e8400-e29b-41d4-a716-446655440104',
  '550e8400-e29b-41d4-a716-446655440303'
)
ORDER BY country_origin, name; 