-- User Behavior Analytics Schema for Hoppn
-- This file contains the database schema for comprehensive user behavior tracking

-- =====================================================
-- USER SESSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    device_type TEXT CHECK (device_type IN ('ios', 'android', 'web')),
    app_version TEXT,
    os_version TEXT,
    device_model TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    session_duration INTEGER, -- in seconds
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER EVENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    screen_name TEXT,
    screen_section TEXT,
    element_id TEXT,
    element_type TEXT,
    element_text TEXT,
    interaction_method TEXT CHECK (interaction_method IN ('tap', 'swipe', 'scroll', 'type', 'voice', 'keyboard')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER PREFERENCES & BEHAVIOR TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_behavior_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Discovery Behavior
    preferred_cuisine_regions TEXT[] DEFAULT '{}',
    preferred_spice_levels INTEGER[] DEFAULT '{}',
    preferred_price_range_min DECIMAL(10,2),
    preferred_price_range_max DECIMAL(10,2),
    preferred_pickup_times TEXT[] DEFAULT '{}',
    
    -- Interaction Patterns
    preferred_browsing_time TEXT, -- e.g., 'lunch', 'dinner', 'weekend'
    preferred_ordering_frequency TEXT CHECK (preferred_ordering_frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'occasional')),
    preferred_restaurant_distance INTEGER, -- in meters
    preferred_dish_categories TEXT[] DEFAULT '{}',
    
    -- Cultural Preferences
    cultural_interest_level INTEGER CHECK (cultural_interest_level >= 1 AND cultural_interest_level <= 5),
    exploration_style TEXT CHECK (exploration_style IN ('adventurous', 'cautious', 'balanced')),
    dietary_restrictions TEXT[] DEFAULT '{}',
    
    -- App Usage Patterns
    average_session_duration INTEGER, -- in seconds
    sessions_per_week INTEGER,
    preferred_screens TEXT[] DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{}',
    
    -- Ordering Behavior
    average_order_value DECIMAL(10,2),
    preferred_payment_method TEXT,
    tip_preference DECIMAL(5,2), -- percentage
    group_ordering_frequency TEXT CHECK (group_ordering_frequency IN ('never', 'rarely', 'sometimes', 'often', 'always')),
    
    -- Feedback & Reviews
    review_frequency TEXT CHECK (review_frequency IN ('never', 'rarely', 'sometimes', 'often', 'always')),
    rating_tendency TEXT CHECK (rating_tendency IN ('generous', 'average', 'strict')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- USER JOURNEY TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_journey_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    journey_stage TEXT NOT NULL,
    journey_step TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    time_spent_on_step INTEGER, -- in seconds
    step_completed BOOLEAN DEFAULT false,
    step_abandoned BOOLEAN DEFAULT false,
    abandonment_reason TEXT,
    step_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTENT INTERACTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.content_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('dish', 'restaurant', 'country', 'cultural_story', 'ingredient', 'review')),
    content_id UUID,
    interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'like', 'share', 'bookmark', 'read', 'watch', 'listen')),
    interaction_duration INTEGER, -- in seconds
    interaction_depth TEXT CHECK (interaction_depth IN ('shallow', 'moderate', 'deep')),
    content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
    feedback_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SEARCH & DISCOVERY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.search_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    search_query TEXT NOT NULL,
    search_type TEXT CHECK (search_type IN ('dish', 'restaurant', 'country', 'ingredient', 'general')),
    search_filters JSONB DEFAULT '{}',
    results_count INTEGER,
    results_clicked INTEGER,
    search_success BOOLEAN, -- whether user found what they were looking for
    time_to_first_click INTEGER, -- in seconds
    search_satisfaction INTEGER CHECK (search_satisfaction >= 1 AND search_satisfaction <= 5),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PERFORMANCE & ERROR TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.performance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    metric_type TEXT NOT NULL CHECK (metric_type IN ('page_load', 'image_load', 'api_call', 'error', 'crash')),
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,3), -- e.g., load time in seconds
    metric_unit TEXT, -- e.g., 'seconds', 'milliseconds', 'bytes'
    error_message TEXT,
    error_stack TEXT,
    error_severity TEXT CHECK (error_severity IN ('low', 'medium', 'high', 'critical')),
    device_info JSONB DEFAULT '{}',
    network_info JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- A/B TESTING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ab_test_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    variant_name TEXT NOT NULL,
    assignment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON public.user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON public.user_sessions(is_active);

-- User Events Indexes
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON public.user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_event_category ON public.user_events(event_category);
CREATE INDEX IF NOT EXISTS idx_user_events_timestamp ON public.user_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_events_screen_name ON public.user_events(screen_name);

-- User Behavior Preferences Indexes
CREATE INDEX IF NOT EXISTS idx_user_behavior_preferences_user_id ON public.user_behavior_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_preferences_cuisine_regions ON public.user_behavior_preferences USING GIN(preferred_cuisine_regions);
CREATE INDEX IF NOT EXISTS idx_user_behavior_preferences_spice_levels ON public.user_behavior_preferences USING GIN(preferred_spice_levels);

-- User Journey Events Indexes
CREATE INDEX IF NOT EXISTS idx_user_journey_events_user_id ON public.user_journey_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_events_session_id ON public.user_journey_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_journey_events_journey_stage ON public.user_journey_events(journey_stage);
CREATE INDEX IF NOT EXISTS idx_user_journey_events_timestamp ON public.user_journey_events(timestamp);

-- Content Interactions Indexes
CREATE INDEX IF NOT EXISTS idx_content_interactions_user_id ON public.content_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_content_type ON public.content_interactions(content_type);
CREATE INDEX IF NOT EXISTS idx_content_interactions_content_id ON public.content_interactions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_interactions_interaction_type ON public.content_interactions(interaction_type);

-- Search Analytics Indexes
CREATE INDEX IF NOT EXISTS idx_search_analytics_user_id ON public.search_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_search_analytics_search_query ON public.search_analytics USING GIN(to_tsvector('english', search_query));
CREATE INDEX IF NOT EXISTS idx_search_analytics_search_type ON public.search_analytics(search_type);
CREATE INDEX IF NOT EXISTS idx_search_analytics_timestamp ON public.search_analytics(timestamp);

-- Performance Metrics Indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_metric_type ON public.performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_error_severity ON public.performance_metrics(error_severity);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON public.performance_metrics(timestamp);

-- A/B Test Indexes
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id ON public.ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test_name ON public.ab_test_assignments(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_is_active ON public.ab_test_assignments(is_active);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- User Sessions RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
    ON public.user_sessions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own sessions"
    ON public.user_sessions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions"
    ON public.user_sessions FOR UPDATE
    USING (user_id = auth.uid());

-- User Events RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own events"
    ON public.user_events FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own events"
    ON public.user_events FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- User Behavior Preferences RLS
ALTER TABLE public.user_behavior_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own behavior preferences"
    ON public.user_behavior_preferences FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own behavior preferences"
    ON public.user_behavior_preferences FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own behavior preferences"
    ON public.user_behavior_preferences FOR UPDATE
    USING (user_id = auth.uid());

-- User Journey Events RLS
ALTER TABLE public.user_journey_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own journey events"
    ON public.user_journey_events FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own journey events"
    ON public.user_journey_events FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Content Interactions RLS
ALTER TABLE public.content_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own content interactions"
    ON public.content_interactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own content interactions"
    ON public.content_interactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Search Analytics RLS
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own search analytics"
    ON public.search_analytics FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own search analytics"
    ON public.search_analytics FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Performance Metrics RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own performance metrics"
    ON public.performance_metrics FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own performance metrics"
    ON public.performance_metrics FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- A/B Test Assignments RLS
ALTER TABLE public.ab_test_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ab test assignments"
    ON public.ab_test_assignments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own ab test assignments"
    ON public.ab_test_assignments FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to all tables with updated_at
CREATE TRIGGER update_user_sessions_updated_at
    BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_updated_at();

CREATE TRIGGER update_user_behavior_preferences_updated_at
    BEFORE UPDATE ON public.user_behavior_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_updated_at();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- ANALYTICS VIEWS FOR ADMIN DASHBOARD
-- =====================================================

-- User Engagement Overview View
CREATE OR REPLACE VIEW public.user_engagement_overview AS
SELECT 
    u.id as user_id,
    u.email,
    u.full_name,
    COUNT(DISTINCT us.session_id) as total_sessions,
    AVG(us.session_duration) as avg_session_duration,
    COUNT(ue.id) as total_events,
    COUNT(DISTINCT DATE(us.session_start)) as active_days,
    MAX(us.session_start) as last_active,
    ubp.preferred_cuisine_regions,
    ubp.preferred_spice_levels,
    ubp.average_order_value
FROM public.users u
LEFT JOIN public.user_sessions us ON u.id = us.user_id
LEFT JOIN public.user_events ue ON u.id = ue.user_id
LEFT JOIN public.user_behavior_preferences ubp ON u.id = ubp.user_id
GROUP BY u.id, u.email, u.full_name, ubp.preferred_cuisine_regions, ubp.preferred_spice_levels, ubp.average_order_value;

-- Popular Content View
CREATE OR REPLACE VIEW public.popular_content AS
SELECT 
    ci.content_type,
    ci.content_id,
    COUNT(*) as interaction_count,
    COUNT(DISTINCT ci.user_id) as unique_users,
    AVG(ci.interaction_duration) as avg_interaction_duration,
    AVG(ci.content_rating) as avg_rating
FROM public.content_interactions ci
WHERE ci.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY ci.content_type, ci.content_id
ORDER BY interaction_count DESC;

-- User Journey Funnel View
CREATE OR REPLACE VIEW public.user_journey_funnel AS
SELECT 
    uje.journey_stage,
    uje.journey_step,
    COUNT(*) as total_users,
    COUNT(CASE WHEN uje.step_completed = true THEN 1 END) as completed_users,
    COUNT(CASE WHEN uje.step_abandoned = true THEN 1 END) as abandoned_users,
    AVG(uje.time_spent_on_step) as avg_time_spent
FROM public.user_journey_events uje
WHERE uje.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY uje.journey_stage, uje.journey_step
ORDER BY uje.journey_stage, uje.step_order;

-- Search Analytics View
CREATE OR REPLACE VIEW public.search_analytics_summary AS
SELECT 
    sa.search_type,
    sa.search_query,
    COUNT(*) as search_count,
    COUNT(DISTINCT sa.user_id) as unique_searchers,
    AVG(sa.results_count) as avg_results,
    AVG(sa.results_clicked) as avg_clicks,
    AVG(sa.search_satisfaction) as avg_satisfaction,
    AVG(sa.time_to_first_click) as avg_time_to_click
FROM public.search_analytics sa
WHERE sa.timestamp >= NOW() - INTERVAL '30 days'
GROUP BY sa.search_type, sa.search_query
ORDER BY search_count DESC;

-- Performance Metrics Summary View
CREATE OR REPLACE VIEW public.performance_metrics_summary AS
SELECT 
    pm.metric_type,
    pm.metric_name,
    AVG(pm.metric_value) as avg_value,
    MIN(pm.metric_value) as min_value,
    MAX(pm.metric_value) as max_value,
    COUNT(*) as total_occurrences,
    COUNT(CASE WHEN pm.error_severity = 'critical' THEN 1 END) as critical_errors,
    COUNT(CASE WHEN pm.error_severity = 'high' THEN 1 END) as high_errors
FROM public.performance_metrics pm
WHERE pm.timestamp >= NOW() - INTERVAL '7 days'
GROUP BY pm.metric_type, pm.metric_name
ORDER BY total_occurrences DESC; 