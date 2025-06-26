-- Hoppn Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
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

-- Vendors table (restaurants)
CREATE TABLE public.vendors (
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
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    dish_id UUID REFERENCES public.dishes(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure either dish_id or vendor_id is provided
    CONSTRAINT review_target_check CHECK (
        (dish_id IS NOT NULL AND vendor_id IS NULL) OR 
        (dish_id IS NULL AND vendor_id IS NOT NULL)
    )
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_vendors_cuisine_type ON public.vendors(cuisine_type);
CREATE INDEX idx_vendors_location ON public.vendors USING GIST (ST_Point(longitude, latitude));
CREATE INDEX idx_vendors_is_open ON public.vendors(is_open);
CREATE INDEX idx_dishes_country_origin ON public.dishes(country_origin);
CREATE INDEX idx_dishes_base_spice_level ON public.dishes(base_spice_level);
CREATE INDEX idx_dishes_is_active ON public.dishes(is_active);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_dish_id ON public.reviews(dish_id);
CREATE INDEX idx_reviews_vendor_id ON public.reviews(vendor_id);

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
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON public.dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Vendors policies (public read, vendor write)
CREATE POLICY "Anyone can view vendors" ON public.vendors
    FOR SELECT USING (true);

-- Dishes policies (public read, Hoppn admin write)
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

-- Functions for common operations

-- Function to calculate vendor rating
CREATE OR REPLACE FUNCTION calculate_vendor_rating(vendor_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN (
        SELECT COALESCE(AVG(r.rating), 0.0)
        FROM public.reviews r
        WHERE r.vendor_id = vendor_uuid
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby vendors
CREATE OR REPLACE FUNCTION get_nearby_vendors(
    user_lat DECIMAL(10,8),
    user_lng DECIMAL(11,8),
    radius_km INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    image_url TEXT,
    cuisine_type cuisine_region,
    rating DECIMAL(3,2),
    pickup_time TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_open BOOLEAN,
    opening_hours TEXT,
    distance_km DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.description,
        v.image_url,
        v.cuisine_type,
        v.rating,
        v.pickup_time,
        v.address,
        v.latitude,
        v.longitude,
        v.is_open,
        v.opening_hours,
        ST_Distance(
            ST_Point(user_lng, user_lat)::geography,
            ST_Point(v.longitude, v.latitude)::geography
        ) / 1000 as distance_km
    FROM public.vendors v
    WHERE ST_DWithin(
        ST_Point(user_lng, user_lat)::geography,
        ST_Point(v.longitude, v.latitude)::geography,
        radius_km * 1000
    )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate Minnesota sales tax (varies by city)
CREATE OR REPLACE FUNCTION calculate_mn_tax(
    subtotal DECIMAL(10,2),
    city TEXT DEFAULT 'Minneapolis'
)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    tax_rate DECIMAL(5,4);
BEGIN
    -- Minnesota tax rates (simplified - you may want to use a more comprehensive lookup)
    CASE city
        WHEN 'Minneapolis' THEN tax_rate := 0.0875; -- 8.75%
        WHEN 'St. Paul' THEN tax_rate := 0.0875;    -- 8.75%
        WHEN 'Bloomington' THEN tax_rate := 0.08125; -- 8.125%
        ELSE tax_rate := 0.0875; -- Default to Minneapolis rate
    END CASE;
    
    RETURN ROUND(subtotal * tax_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- Insert sample data (optional - for testing)
-- You can uncomment and modify these inserts for testing

/*
-- Sample vendors
INSERT INTO public.vendors (name, description, image_url, cuisine_type, pickup_time, address, latitude, longitude, opening_hours, phone_number, email) VALUES
('Mama Africa Kitchen', 'Authentic West African cuisine with traditional recipes passed down through generations', 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg', 'West African', '25-35 min', '1234 University Ave, Minneapolis, MN', 44.9778, -93.2650, '11:00 AM - 10:00 PM', '+1-612-555-0123', 'mama@africakitchen.com'),
('Ethiopian Spice House', 'Traditional Ethiopian dishes served on fresh injera bread', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 'East African', '30-40 min', '5678 Cedar Ave, Minneapolis, MN', 44.9537, -93.2473, '12:00 PM - 9:00 PM', '+1-612-555-0124', 'spice@ethiopianhouse.com');

-- Sample dishes
INSERT INTO public.dishes (vendor_id, name, description, image_url, price, category, spice_level, country_origin, country_flag, origin_story, ingredients, is_vegetarian, is_vegan) VALUES
((SELECT id FROM public.vendors WHERE name = 'Mama Africa Kitchen' LIMIT 1), 'Jollof Rice', 'Fragrant rice cooked in a rich tomato sauce with spices, served with grilled chicken', 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg', 16.99, 'Main Course', 2, 'Nigeria', '🇳🇬', 'Jollof rice is a beloved West African dish with origins dating back to the 14th century in the Senegambian region.', ARRAY['Rice', 'Tomatoes', 'Onions', 'Bell peppers', 'Spices', 'Chicken stock'], false, false);
*/ 