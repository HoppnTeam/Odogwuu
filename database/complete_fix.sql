-- Complete Database Fix Script
-- Run this in your Supabase SQL editor to fix all current issues

-- First, let's drop and recreate the problematic tables to ensure clean state
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.dishes CASCADE;
DROP TABLE IF EXISTS public.restaurants CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.order_id_counters CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS cuisine_region CASCADE;

-- Recreate custom types
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE cuisine_region AS ENUM ('West African', 'East African', 'North African', 'South African', 'Central African');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    dietary_preferences TEXT[] DEFAULT '{}',
    spice_tolerance INTEGER CHECK (spice_tolerance >= 1 AND spice_tolerance <= 5) DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurants table (managed through web interface)
CREATE TABLE public.restaurants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    cuisine_type cuisine_region NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    pickup_time TEXT NOT NULL, -- e.g., "25-35 min"
    address TEXT NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    is_open BOOLEAN DEFAULT true,
    opening_hours TEXT NOT NULL, -- e.g., "11:00 AM - 10:00 PM"
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dishes table (Hoppn-curated authentic African dishes)
CREATE TABLE public.dishes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price > 0),
    category TEXT NOT NULL, -- e.g., "Main Course", "Appetizer", "Dessert"
    base_spice_level INTEGER NOT NULL CHECK (base_spice_level >= 1 AND base_spice_level <= 5),
    country_origin TEXT NOT NULL,
    country_flag TEXT NOT NULL,
    origin_story TEXT NOT NULL,
    base_ingredients TEXT[] NOT NULL,
    is_vegetarian BOOLEAN DEFAULT false,
    is_vegan BOOLEAN DEFAULT false,
    calories INTEGER,
    preparation_method TEXT,
    cultural_significance TEXT,
    health_benefits TEXT,
    native_regions TEXT[],
    taste_profile TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
    items JSONB NOT NULL, -- Array of CartItem objects
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    service_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    status order_status DEFAULT 'pending',
    pickup_location TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    estimated_pickup_time TIMESTAMP WITH TIME ZONE,
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    special_instructions TEXT,
    hp_order_id VARCHAR(15) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    spice_level_rating INTEGER CHECK (spice_level_rating >= 1 AND spice_level_rating <= 5),
    authenticity_rating INTEGER CHECK (authenticity_rating >= 1 AND authenticity_rating <= 5),
    cultural_experience_rating INTEGER CHECK (cultural_experience_rating >= 1 AND cultural_experience_rating <= 5),
    overall_experience INTEGER CHECK (overall_experience >= 1 AND overall_experience <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either dish_id or restaurant_id is provided
    CONSTRAINT review_target_check CHECK (
        (dish_id IS NOT NULL AND restaurant_id IS NULL) OR 
        (dish_id IS NULL AND restaurant_id IS NOT NULL)
    )
);

-- Order ID Counters table for HP order ID generation
CREATE TABLE IF NOT EXISTS public.order_id_counters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    year VARCHAR(2) NOT NULL UNIQUE, -- Last 2 digits of year (e.g., '25' for 2025)
    current_number INTEGER NOT NULL DEFAULT 1, -- Current sequential number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_restaurants_cuisine_type ON public.restaurants(cuisine_type);
CREATE INDEX idx_restaurants_location ON public.restaurants USING GIST (ST_Point(longitude, latitude));
CREATE INDEX idx_restaurants_is_open ON public.restaurants(is_open);
CREATE INDEX idx_dishes_restaurant_id ON public.dishes(restaurant_id);
CREATE INDEX idx_dishes_country_origin ON public.dishes(country_origin);
CREATE INDEX idx_dishes_base_spice_level ON public.dishes(base_spice_level);
CREATE INDEX idx_dishes_is_active ON public.dishes(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_dish_id ON public.reviews(dish_id);
CREATE INDEX idx_reviews_restaurant_id ON public.reviews(restaurant_id);
CREATE INDEX idx_orders_hp_order_id ON public.orders(hp_order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON public.restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_id_counters ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Restaurants policies (public read, restaurant admin write through web interface)
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
    FOR SELECT USING (true);

-- Dishes policies (public read, restaurant admin write through web interface)
CREATE POLICY "Anyone can view active dishes" ON public.dishes
    FOR SELECT USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their orders" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Order ID Counters policies
CREATE POLICY "Service role only" ON public.order_id_counters
    FOR ALL USING (auth.role() = 'service_role');

-- Insert sample data for testing
INSERT INTO public.restaurants (
    id, name, description, image_url, cuisine_type, rating, pickup_time, 
    address, latitude, longitude, is_open, opening_hours, phone_number, email
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Mama Africa Kitchen',
    'Authentic African cuisine from across the continent',
    'https://example.com/mama-africa.jpg',
    'West African',
    4.5,
    '20-30 min',
    '1234 University Ave, Minneapolis, MN 55401',
    44.9778,
    -93.2650,
    true,
    '11:00 AM - 10:00 PM',
    '+1-612-555-0123',
    'info@mamaafricakitchen.com'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Ethiopian Spice House',
    'Traditional Ethiopian dishes with authentic spices',
    'https://example.com/ethiopian-spice.jpg',
    'East African',
    4.3,
    '15-25 min',
    '5678 Lake Street, Minneapolis, MN 55406',
    44.9550,
    -93.2650,
    true,
    '10:00 AM - 9:00 PM',
    '+1-612-555-0456',
    'info@ethiopianspicehouse.com'
);

-- Insert sample dishes
INSERT INTO public.dishes (
    id, restaurant_id, name, description, image_url, base_price, category, base_spice_level,
    country_origin, country_flag, origin_story, base_ingredients, is_vegetarian, is_vegan
) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Jollof Rice',
    'Aromatic rice cooked in a rich tomato sauce with African spices',
    'https://example.com/jollof-rice.jpg',
    16.99,
    'Main Course',
    3,
    'Nigeria',
    '🇳🇬',
    'Jollof Rice is a beloved West African dish that originated in the Wolof Empire. It represents celebration and community, often served at weddings and festivals.',
    ARRAY['rice', 'tomatoes', 'onions', 'bell peppers', 'scotch bonnet peppers', 'thyme', 'bay leaves'],
    false,
    false
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Suya',
    'Spicy grilled meat skewers with peanut coating',
    'https://example.com/suya.jpg',
    14.99,
    'Appetizer',
    4,
    'Nigeria',
    '🇳🇬',
    'Suya is a popular street food in Northern Nigeria, traditionally made by the Hausa people. The peanut coating and spices create a unique flavor profile.',
    ARRAY['beef', 'peanuts', 'cayenne pepper', 'paprika', 'onion powder', 'garlic powder'],
    false,
    false
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    'Doro Wat',
    'Spicy Ethiopian chicken stew with berbere spice',
    'https://example.com/doro-wat.jpg',
    18.99,
    'Main Course',
    4,
    'Ethiopia',
    '🇪🇹',
    'Doro Wat is a traditional Ethiopian dish often served during holidays and celebrations. The berbere spice blend gives it its distinctive heat and flavor.',
    ARRAY['chicken', 'berbere', 'onions', 'garlic', 'ginger', 'cardamom', 'cloves'],
    false,
    false
);

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial counter for 2025 if it doesn't exist
INSERT INTO public.order_id_counters (year, current_number)
VALUES ('25', 1)
ON CONFLICT (year) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_id_counters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_order_id_counters_updated_at
    BEFORE UPDATE ON public.order_id_counters
    FOR EACH ROW
    EXECUTE FUNCTION update_order_id_counters_updated_at();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 