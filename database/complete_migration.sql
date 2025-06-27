-- Hoppn Complete Migration
-- Run this in your Supabase SQL Editor to create missing tables and fix RLS policies

-- =====================================================
-- CREATE MISSING TABLES
-- =====================================================

-- Create onboarding_data table
CREATE TABLE IF NOT EXISTS public.onboarding_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    dietary_preferences TEXT[] DEFAULT '{}',
    spice_tolerance INTEGER CHECK (spice_tolerance >= 1 AND spice_tolerance <= 5) DEFAULT 3,
    exploration_style TEXT CHECK (exploration_style IN ('adventurous', 'cautious', 'balanced')) DEFAULT 'balanced',
    order_frequency TEXT CHECK (order_frequency IN ('weekly', 'biweekly', 'monthly', 'occasional')) DEFAULT 'occasional',
    location_permissions BOOLEAN DEFAULT false,
    notification_permissions BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to onboarding_data
DROP TRIGGER IF EXISTS set_updated_at_on_onboarding_data ON public.onboarding_data;
CREATE TRIGGER set_updated_at_on_onboarding_data
    BEFORE UPDATE ON public.onboarding_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- RLS POLICIES FOR EXISTING TABLES
-- =====================================================

-- USERS TABLE RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.users;

-- Create correct policies
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can delete their own profile"
  ON public.users
  FOR DELETE
  USING (id = auth.uid());

-- ORDERS TABLE RLS POLICIES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Users can delete their own orders" ON public.orders;
        
        CREATE POLICY "Users can insert their own orders"
          ON public.orders
          FOR INSERT
          WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can view their own orders"
          ON public.orders
          FOR SELECT
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own orders"
          ON public.orders
          FOR UPDATE
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can delete their own orders"
          ON public.orders
          FOR DELETE
          USING (user_id = auth.uid());
    END IF;
END $$;

-- REVIEWS TABLE RLS POLICIES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
        DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
        
        CREATE POLICY "Users can insert their own reviews"
          ON public.reviews
          FOR INSERT
          WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can view their own reviews"
          ON public.reviews
          FOR SELECT
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own reviews"
          ON public.reviews
          FOR UPDATE
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can delete their own reviews"
          ON public.reviews
          FOR DELETE
          USING (user_id = auth.uid());
    END IF;
END $$;

-- DISHES TABLE RLS POLICIES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dishes') THEN
        ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view all dishes" ON public.dishes;
        
        CREATE POLICY "Users can view all dishes"
          ON public.dishes
          FOR SELECT
          USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- COUNTRIES TABLE RLS POLICIES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'countries') THEN
        ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view all countries" ON public.countries;
        
        CREATE POLICY "Users can view all countries"
          ON public.countries
          FOR SELECT
          USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- CART TABLE RLS POLICIES (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cart') THEN
        ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart;
        DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart;
        DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart;
        DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart;
        
        CREATE POLICY "Users can insert their own cart items"
          ON public.cart
          FOR INSERT
          WITH CHECK (user_id = auth.uid());
        
        CREATE POLICY "Users can view their own cart items"
          ON public.cart
          FOR SELECT
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can update their own cart items"
          ON public.cart
          FOR UPDATE
          USING (user_id = auth.uid());
        
        CREATE POLICY "Users can delete their own cart items"
          ON public.cart
          FOR DELETE
          USING (user_id = auth.uid());
    END IF;
END $$;

-- =====================================================
-- ONBOARDING DATA TABLE RLS POLICIES
-- =====================================================

ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own onboarding data"
  ON public.onboarding_data
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own onboarding data"
  ON public.onboarding_data
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own onboarding data"
  ON public.onboarding_data
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own onboarding data"
  ON public.onboarding_data
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify all tables and policies are created correctly:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname; 