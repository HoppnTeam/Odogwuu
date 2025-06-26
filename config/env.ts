// Environment Configuration
// Copy this file to .env and fill in your actual values

export const ENV_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || 'your_supabase_project_url',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key',
  
  // Stripe Configuration (for future use)
  STRIPE_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_stripe_publishable_key',
  
  // Mapbox Configuration (for future use)
  MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || 'your_mapbox_access_token',
  
  // Twilio Configuration (for future use)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || 'your_twilio_phone_number',
  
  // SendGrid Configuration (for future use)
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'your_sendgrid_api_key',
};

// Validation function to check if required environment variables are set
export const validateEnvironment = () => {
  const requiredVars = [
    'EXPO_PUBLIC_SUPABASE_URL',
    'EXPO_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    console.warn('Please create a .env file with the required variables');
    return false;
  }
  
  return true;
}; 