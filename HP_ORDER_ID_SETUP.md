# HP Order ID System Setup Guide

This guide explains how to set up the HP Order ID generation system for the Hoppn mobile app.

## Overview

The HP Order ID system generates unique, human-readable order IDs in the format `HP-YY-XXXXXXX` (e.g., `HP-25-0001234`):
- **HP** = Hoppn prefix
- **25** = Year (2025 → 25)
- **0001234** = 7-digit sequential number

## Database Setup

### 1. Create Order ID Counters Table

Run the following SQL in your Supabase SQL editor:

```sql
-- Order ID Counters table for HP order ID generation
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
```

### 2. Update Orders Table

Add the HP order ID field to your orders table:

```sql
-- Add HP order ID column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS hp_order_id VARCHAR(15) UNIQUE;

-- Create index for HP order ID lookups
CREATE INDEX IF NOT EXISTS idx_orders_hp_order_id ON public.orders(hp_order_id);
```

## Supabase Edge Function Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy the Edge Function

The Edge Function is located at `supabase/functions/generate-order-id/index.ts`. Deploy it using:

```bash
supabase functions deploy generate-order-id
```

### 5. Set Environment Variables

Make sure your Supabase project has the following environment variables set:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Testing the Edge Function

You can test the Edge Function using curl:

```bash
curl -X POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/generate-order-id' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json'
```

Expected response:
```json
{
  "order_id": "HP-25-0000001",
  "year": "25",
  "sequence_number": 1
}
```

## Integration Points

### 1. Order Creation

The `orderService.createOrder()` method now automatically generates HP order IDs using the Edge Function.

### 2. Order Tracking

HP order IDs are displayed prominently in:
- Order tracking screen
- Order confirmation alerts
- Push notifications

### 3. Order History

HP order IDs are shown in the profile screen's order history section.

### 4. Notifications

Push notifications include HP order IDs for better customer reference.

## Error Handling

The system includes fallback mechanisms:
- If the Edge Function fails, a timestamp-based ID is generated
- Database errors are logged and handled gracefully
- UI shows appropriate error messages

## Monitoring

Monitor the following for system health:
- Edge Function invocation logs in Supabase dashboard
- Order ID counter table for sequence integrity
- Failed order creation attempts

## Troubleshooting

### Common Issues

1. **Edge Function not found**: Ensure the function is deployed and the URL is correct
2. **Permission denied**: Check RLS policies and service role permissions
3. **Duplicate order IDs**: Verify the counter table is working correctly

### Debug Steps

1. Check Supabase function logs
2. Verify database table structure
3. Test Edge Function directly
4. Check environment variables

## Security Considerations

- Only service role can access the order_id_counters table
- Edge Function validates all inputs
- Order IDs are unique and cannot be duplicated
- RLS policies prevent unauthorized access

## Future Enhancements

- Add year rollover handling
- Implement order ID validation
- Add analytics for order ID usage
- Consider regional prefixes for multi-region expansion 