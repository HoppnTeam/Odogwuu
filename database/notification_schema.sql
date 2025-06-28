-- Notification System Schema for Hoppn
-- This file contains the database schema for user notification tokens and preferences

-- User notification tokens table
-- Stores Expo push tokens for each user device
CREATE TABLE IF NOT EXISTS user_notification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  expo_push_token text NOT NULL,
  device_type text CHECK (device_type IN ('ios', 'android', 'web')),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User notification preferences table
-- Stores user preferences for different types of notifications
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_updates boolean DEFAULT true,
  cultural_content boolean DEFAULT true,
  promotional boolean DEFAULT false,
  pickup_reminders boolean DEFAULT true,
  new_restaurants boolean DEFAULT true,
  featured_dishes boolean DEFAULT true,
  loyalty_achievements boolean DEFAULT true,
  seasonal_content boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Notification history table
-- Stores sent notifications for analytics and user history
CREATE TABLE IF NOT EXISTS notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  data jsonb,
  sent_at timestamp with time zone DEFAULT now(),
  delivered boolean DEFAULT false,
  opened boolean DEFAULT false,
  opened_at timestamp with time zone
);

-- Notification templates table
-- Stores reusable notification templates
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text UNIQUE NOT NULL,
  title_template text NOT NULL,
  body_template text NOT NULL,
  notification_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default notification templates
INSERT INTO notification_templates (template_name, title_template, body_template, notification_type) VALUES
  ('order_confirmed', 'Order Confirmed! 🎉', 'Your order from {restaurant_name} is confirmed! Pickup in {estimated_time} minutes.', 'order_status'),
  ('order_preparing', 'Kitchen is Cooking! 👨‍🍳', 'Your authentic African dishes are being prepared with love at {restaurant_name}', 'order_status'),
  ('order_ready', 'Order Ready for Pickup! 🍽️', 'Your delicious order is ready at {restaurant_name}. Bon appétit!', 'order_status'),
  ('pickup_reminder', 'Pickup Reminder ⏰', 'Don''t forget - your order at {restaurant_name} expires in 15 minutes', 'order_status'),
  ('order_complete', 'Thanks for choosing Hoppn! 🌍', 'Rate your experience with {restaurant_name} and help others discover authentic African cuisine', 'order_status'),
  ('cultural_discovery', 'Discover {country} Cuisine {flag}', 'Learn the fascinating story behind {dish_name} and its cultural significance', 'cultural_discovery'),
  ('new_restaurant', 'New African Restaurant Near You! 🆕', 'Discover {restaurant_name} serving authentic {cuisine_type} cuisine from {country}', 'new_restaurant'),
  ('featured_dish', 'Today''s Featured Dish {flag}', 'Try today''s featured dish: {dish_name} from {country}', 'featured_dish'),
  ('promotional', 'Special Offer Just for You! 🎁', '{discount} off your next {cuisine_type} dish order', 'promotional'),
  ('loyalty', 'Achievement Unlocked! 🏆', 'You''ve tried {countries_tried} countries! Unlock your {badge_name} badge', 'loyalty'),
  ('seasonal', 'Celebrate {holiday}! 🌟', 'Discover traditional dishes from {countries_count} African countries', 'seasonal')
ON CONFLICT (template_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notification_tokens_user_id ON user_notification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_tokens_token ON user_notification_tokens(expo_push_token);
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON notification_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_notification_history_type ON notification_history(notification_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_notification_tokens_updated_at 
  BEFORE UPDATE ON user_notification_tokens 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at 
  BEFORE UPDATE ON user_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
  BEFORE UPDATE ON notification_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_notification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- User notification tokens policies
CREATE POLICY "Users can view their own notification tokens" ON user_notification_tokens
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification tokens" ON user_notification_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification tokens" ON user_notification_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification tokens" ON user_notification_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- User notification preferences policies
CREATE POLICY "Users can view their own notification preferences" ON user_notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" ON user_notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" ON user_notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification preferences" ON user_notification_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Notification history policies
CREATE POLICY "Users can view their own notification history" ON notification_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification history" ON notification_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification history" ON notification_history
  FOR UPDATE USING (auth.uid() = user_id);

-- Notification templates policies (read-only for users)
CREATE POLICY "Anyone can view notification templates" ON notification_templates
  FOR SELECT USING (true);

-- Functions for notification management

-- Function to get user's active notification tokens
CREATE OR REPLACE FUNCTION get_user_notification_tokens(user_uuid uuid)
RETURNS TABLE(expo_push_token text) AS $$
BEGIN
  RETURN QUERY
  SELECT unt.expo_push_token
  FROM user_notification_tokens unt
  WHERE unt.user_id = user_uuid AND unt.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's notification preferences
CREATE OR REPLACE FUNCTION get_user_notification_preferences(user_uuid uuid)
RETURNS TABLE(
  order_updates boolean,
  cultural_content boolean,
  promotional boolean,
  pickup_reminders boolean,
  new_restaurants boolean,
  featured_dishes boolean,
  loyalty_achievements boolean,
  seasonal_content boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unp.order_updates,
    unp.cultural_content,
    unp.promotional,
    unp.pickup_reminders,
    unp.new_restaurants,
    unp.featured_dishes,
    unp.loyalty_achievements,
    unp.seasonal_content
  FROM user_notification_preferences unp
  WHERE unp.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log notification
CREATE OR REPLACE FUNCTION log_notification(
  user_uuid uuid,
  notification_type text,
  notification_title text,
  notification_body text,
  notification_data jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notification_history (
    user_id,
    notification_type,
    title,
    body,
    data
  ) VALUES (
    user_uuid,
    notification_type,
    notification_title,
    notification_body,
    notification_data
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 