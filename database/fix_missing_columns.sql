-- Fix Missing Columns Script
-- Run this in your Supabase SQL editor to add missing columns

-- Add onboarding_data column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}';

-- Add total_amount column to orders table (if not already present)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0);

-- Update the orders table to ensure total_amount is properly calculated
-- This will set total_amount to 0 for existing orders that might have NULL values
UPDATE public.orders 
SET total_amount = 0 
WHERE total_amount IS NULL;

-- Make total_amount NOT NULL after setting default values
ALTER TABLE public.orders 
ALTER COLUMN total_amount SET NOT NULL;

-- Add any other missing columns that might be needed
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure the trigger for updated_at exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 