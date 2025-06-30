-- Order ID Counters table for HP order ID generation
-- This table tracks sequential numbers for each year to generate HP-YY-XXXXXXX format

CREATE TABLE IF NOT EXISTS public.order_id_counters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    year VARCHAR(2) NOT NULL UNIQUE, -- Last 2 digits of year (e.g., '25' for 2025)
    current_number INTEGER NOT NULL DEFAULT 1, -- Current sequential number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.order_id_counters ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access this table
CREATE POLICY "Service role only" ON public.order_id_counters
    FOR ALL USING (auth.role() = 'service_role');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_order_id_counters_year ON public.order_id_counters(year);

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