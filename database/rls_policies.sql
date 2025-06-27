-- Hoppn RLS Policies Migration
-- Run this in your Supabase SQL Editor to fix the RLS policies

-- =====================================================
-- USERS TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile (WITH CHECK for INSERT)
CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- Allow users to view their own profile (USING for SELECT)
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (id = auth.uid());

-- Allow users to update their own profile (USING for UPDATE)
CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (id = auth.uid());

-- Allow users to delete their own profile (USING for DELETE)
CREATE POLICY "Users can delete their own profile"
  ON public.users
  FOR DELETE
  USING (id = auth.uid());

-- =====================================================
-- ORDERS TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own orders (WITH CHECK for INSERT)
CREATE POLICY "Users can insert their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to view their own orders (USING for SELECT)
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own orders (USING for UPDATE)
CREATE POLICY "Users can update their own orders"
  ON public.orders
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own orders (USING for DELETE)
CREATE POLICY "Users can delete their own orders"
  ON public.orders
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- REVIEWS TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on reviews table
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own reviews (WITH CHECK for INSERT)
CREATE POLICY "Users can insert their own reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to view their own reviews (USING for SELECT)
CREATE POLICY "Users can view their own reviews"
  ON public.reviews
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own reviews (USING for UPDATE)
CREATE POLICY "Users can update their own reviews"
  ON public.reviews
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own reviews (USING for DELETE)
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- ONBOARDING DATA TABLE RLS POLICIES
-- =====================================================

-- Enable RLS on onboarding_data table (if it exists)
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own onboarding data (WITH CHECK for INSERT)
CREATE POLICY "Users can insert their own onboarding data"
  ON public.onboarding_data
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to view their own onboarding data (USING for SELECT)
CREATE POLICY "Users can view their own onboarding data"
  ON public.onboarding_data
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own onboarding data (USING for UPDATE)
CREATE POLICY "Users can update their own onboarding data"
  ON public.onboarding_data
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own onboarding data (USING for DELETE)
CREATE POLICY "Users can delete their own onboarding data"
  ON public.onboarding_data
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- DISHES TABLE RLS POLICIES (Read-only for users)
-- =====================================================

-- Enable RLS on dishes table
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view dishes (USING for SELECT)
CREATE POLICY "Users can view all dishes"
  ON public.dishes
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- COUNTRIES TABLE RLS POLICIES (Read-only for users)
-- =====================================================

-- Enable RLS on countries table
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to view countries (USING for SELECT)
CREATE POLICY "Users can view all countries"
  ON public.countries
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- =====================================================
-- CART TABLE RLS POLICIES (if you have a cart table)
-- =====================================================

-- Enable RLS on cart table (if it exists)
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own cart items (WITH CHECK for INSERT)
CREATE POLICY "Users can insert their own cart items"
  ON public.cart
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to view their own cart items (USING for SELECT)
CREATE POLICY "Users can view their own cart items"
  ON public.cart
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update their own cart items (USING for UPDATE)
CREATE POLICY "Users can update their own cart items"
  ON public.cart
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own cart items (USING for DELETE)
CREATE POLICY "Users can delete their own cart items"
  ON public.cart
  FOR DELETE
  USING (user_id = auth.uid());

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify all policies are created correctly:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, policyname; 