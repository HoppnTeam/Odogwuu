-- Hoppn Dishes RLS Policies (Minimal, Vendor/Admin Only)
-- Only vendors and admins (service_role) can access this table
-- No customer, public, or general authenticated user access

-- Enable RLS on hoppn_dishes table
ALTER TABLE public.hoppn_dishes ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Vendors can access hoppn dishes" ON public.hoppn_dishes;
DROP POLICY IF EXISTS "Service role can manage hoppn dishes" ON public.hoppn_dishes;
DROP POLICY IF EXISTS "Public can view active hoppn dishes" ON public.hoppn_dishes;
DROP POLICY IF EXISTS "Authenticated users can view all hoppn dishes" ON public.hoppn_dishes;
DROP POLICY IF EXISTS "Vendors can view hoppn dishes for menu building" ON public.hoppn_dishes;

-- Vendors can SELECT from hoppn_dishes
CREATE POLICY "Vendors can access hoppn dishes"
    ON public.hoppn_dishes
    FOR SELECT
    USING (
        auth.role() = 'vendor'
    );

-- Service role (admin) can do anything
CREATE POLICY "Service role can manage hoppn dishes"
    ON public.hoppn_dishes
    FOR ALL
    USING (
        auth.role() = 'service_role'
    );

-- Comments for clarity
COMMENT ON TABLE public.hoppn_dishes IS 'Platform-owned dishes that vendors can select to build their menus. Only accessible to vendors and admins.';
COMMENT ON POLICY "Vendors can access hoppn dishes" ON public.hoppn_dishes IS 'Restricts access to hoppn_dishes to only vendors.';
COMMENT ON POLICY "Service role can manage hoppn dishes" ON public.hoppn_dishes IS 'Admins (service_role) have full access.'; 