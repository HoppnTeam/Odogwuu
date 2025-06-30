-- Enhanced Security Policies for Hoppn Mobile App
-- This file contains additional security measures beyond the basic RLS policies

-- 1. Enhanced User Profile Security
-- Users can only view and update their own profile data
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Prevent users from deleting their own profiles (soft delete only)
CREATE POLICY "Users cannot delete profiles" ON public.users
    FOR DELETE USING (false);

-- 2. Enhanced Order Security
-- Users can only access their own orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Prevent users from deleting orders (audit trail)
CREATE POLICY "Users cannot delete orders" ON public.orders
    FOR DELETE USING (false);

-- 3. Enhanced Review Security
-- Users can only create reviews for their own orders
DROP POLICY IF EXISTS "Users can create reviews for their orders" ON public.reviews;
CREATE POLICY "Users can create reviews for their orders" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

-- Users can only update their own reviews
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Restaurant and Dish Security (Read-only for customers)
-- Anyone can view restaurants (public data)
DROP POLICY IF EXISTS "Anyone can view restaurants" ON public.restaurants;
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
    FOR SELECT USING (true);

-- Prevent customers from modifying restaurant data
CREATE POLICY "Customers cannot modify restaurants" ON public.restaurants
    FOR ALL USING (false);

-- Anyone can view active dishes (public data)
DROP POLICY IF EXISTS "Anyone can view active dishes" ON public.dishes;
CREATE POLICY "Anyone can view active dishes" ON public.dishes
    FOR SELECT USING (is_active = true);

-- Prevent customers from modifying dish data
CREATE POLICY "Customers cannot modify dishes" ON public.dishes
    FOR ALL USING (false);

-- 5. Order ID Counters Security (Service role only)
DROP POLICY IF EXISTS "Service role only" ON public.order_id_counters;
CREATE POLICY "Service role only" ON public.order_id_counters
    FOR ALL USING (auth.role() = 'service_role');

-- 6. Additional Security Functions

-- Function to validate user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    user_id UUID,
    action TEXT,
    resource_type TEXT DEFAULT NULL,
    resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is authenticated
    IF user_id IS NULL OR user_id != auth.uid() THEN
        RETURN FALSE;
    END IF;
    
    -- Define permission matrix
    CASE action
        WHEN 'read_own_profile' THEN
            RETURN resource_type = 'user' AND resource_id = user_id;
        WHEN 'update_own_profile' THEN
            RETURN resource_type = 'user' AND resource_id = user_id;
        WHEN 'read_own_orders' THEN
            RETURN resource_type = 'order' AND resource_id IN (
                SELECT id FROM public.orders WHERE user_id = user_id
            );
        WHEN 'create_order' THEN
            RETURN TRUE; -- Authenticated users can create orders
        WHEN 'update_own_order' THEN
            RETURN resource_type = 'order' AND resource_id IN (
                SELECT id FROM public.orders WHERE user_id = user_id
            );
        WHEN 'read_own_reviews' THEN
            RETURN resource_type = 'review' AND resource_id IN (
                SELECT id FROM public.reviews WHERE user_id = user_id
            );
        WHEN 'create_review' THEN
            RETURN TRUE; -- Authenticated users can create reviews
        WHEN 'update_own_review' THEN
            RETURN resource_type = 'review' AND resource_id IN (
                SELECT id FROM public.reviews WHERE user_id = user_id
            );
        WHEN 'read_public_data' THEN
            RETURN resource_type IN ('restaurant', 'dish'); -- Public data
        ELSE
            RETURN FALSE; -- Default deny
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log security events
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access audit log
CREATE POLICY "Service role only for audit log" ON security_audit_log
    FOR ALL USING (auth.role() = 'service_role');

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO security_audit_log (
        user_id,
        action,
        resource_type,
        resource_id,
        success,
        error_message
    ) VALUES (
        auth.uid(),
        p_action,
        p_resource_type,
        p_resource_id,
        p_success,
        p_error_message
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Input Validation Functions

-- Function to validate email format
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate phone number format
CREATE OR REPLACE FUNCTION validate_phone(phone TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN phone ~* '^\+?[\d\s\-\(\)]{10,15}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to sanitize text input
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Remove potentially dangerous characters and scripts
    RETURN regexp_replace(
        regexp_replace(
            regexp_replace(
                regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi'),
                'javascript:', '', 'gi'
            ),
            'on\w+\s*=', '', 'gi'
        ),
        '<iframe[^>]*>.*?</iframe>', '', 'gi'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. Rate Limiting Functions

-- Table to track rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    attempts INTEGER DEFAULT 1,
    first_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_attempt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blocked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate limits
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit records
CREATE POLICY "Users can view own rate limits" ON rate_limits
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all rate limits
CREATE POLICY "Service role can manage rate limits" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_action TEXT,
    p_max_attempts INTEGER DEFAULT 5,
    p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
    v_rate_limit_record rate_limits%ROWTYPE;
    v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Calculate window start
    v_window_start := NOW() - INTERVAL '1 minute' * p_window_minutes;
    
    -- Get or create rate limit record
    SELECT * INTO v_rate_limit_record
    FROM rate_limits
    WHERE user_id = auth.uid() 
      AND action = p_action
      AND last_attempt > v_window_start;
    
    -- If no record exists or window has passed, allow
    IF v_rate_limit_record IS NULL THEN
        INSERT INTO rate_limits (user_id, action)
        VALUES (auth.uid(), p_action);
        RETURN TRUE;
    END IF;
    
    -- Check if blocked
    IF v_rate_limit_record.blocked_until IS NOT NULL AND v_rate_limit_record.blocked_until > NOW() THEN
        RETURN FALSE;
    END IF;
    
    -- Check attempts
    IF v_rate_limit_record.attempts >= p_max_attempts THEN
        -- Block for window duration
        UPDATE rate_limits
        SET blocked_until = NOW() + INTERVAL '1 minute' * p_window_minutes
        WHERE id = v_rate_limit_record.id;
        RETURN FALSE;
    END IF;
    
    -- Increment attempts
    UPDATE rate_limits
    SET attempts = attempts + 1,
        last_attempt = NOW()
    WHERE id = v_rate_limit_record.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Session Management Functions

-- Function to check if user session is valid
CREATE OR REPLACE FUNCTION is_session_valid()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user exists and is active
    IF NOT EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() 
          AND email_confirmed_at IS NOT NULL
          AND banned_until IS NULL
    ) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Data Access Control Functions

-- Function to check if user can access specific data
CREATE OR REPLACE FUNCTION can_access_data(
    p_resource_type TEXT,
    p_resource_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Public resources
    IF p_resource_type IN ('restaurant', 'dish') THEN
        RETURN TRUE;
    END IF;
    
    -- User-specific resources
    IF p_resource_type IN ('user', 'order', 'review') THEN
        RETURN p_resource_id IN (
            SELECT id FROM public.users WHERE id = p_resource_id AND id = auth.uid()
            UNION
            SELECT id FROM public.orders WHERE id = p_resource_id AND user_id = auth.uid()
            UNION
            SELECT id FROM public.reviews WHERE id = p_resource_id AND user_id = auth.uid()
        );
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON security_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_last_attempt ON rate_limits(last_attempt);

-- 12. Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_user_permission(UUID, TEXT, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION log_security_event(TEXT, TEXT, UUID, BOOLEAN, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_phone(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION sanitize_text(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION is_session_valid() TO authenticated;
GRANT EXECUTE ON FUNCTION can_access_data(TEXT, UUID) TO authenticated;

-- 13. Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 