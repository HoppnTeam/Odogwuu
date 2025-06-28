import { supabase } from './supabase';

/**
 * Simple integration test to verify database connections
 * Run this in your app to test if all tables are accessible
 */
export const testDatabaseIntegration = async () => {
  console.log('🧪 Testing Hoppn Database Integration...\n');

  const results = {
    users: false,
    restaurants: false,
    dishes: false,
    countries: false,
    orders: false,
    reviews: false,
    onboarding_data: false
  };

  try {
    // Test users table
    console.log('1. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      results.users = true;
      console.log('✅ Users table accessible');
    }

    // Test restaurants table
    console.log('2. Testing restaurants table...');
    const { data: restaurants, error: restaurantsError } = await supabase
      .from('restaurants')
      .select('id, name, cuisine_type')
      .limit(1);
    
    if (restaurantsError) {
      console.log('❌ Restaurants table error:', restaurantsError.message);
    } else {
      results.restaurants = true;
      console.log('✅ Restaurants table accessible');
    }

    // Test dishes table
    console.log('3. Testing dishes table...');
    const { data: dishes, error: dishesError } = await supabase
      .from('dishes')
      .select('id, name, country_origin')
      .limit(1);
    
    if (dishesError) {
      console.log('❌ Dishes table error:', dishesError.message);
    } else {
      results.dishes = true;
      console.log('✅ Dishes table accessible');
    }

    // Test countries table
    console.log('4. Testing countries table...');
    const { data: countries, error: countriesError } = await supabase
      .from('countries')
      .select('id, name, flag')
      .limit(1);
    
    if (countriesError) {
      console.log('❌ Countries table error:', countriesError.message);
    } else {
      results.countries = true;
      console.log('✅ Countries table accessible');
    }

    // Test orders table
    console.log('5. Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, status, total_amount')
      .limit(1);
    
    if (ordersError) {
      console.log('❌ Orders table error:', ordersError.message);
    } else {
      results.orders = true;
      console.log('✅ Orders table accessible');
    }

    // Test reviews table
    console.log('6. Testing reviews table...');
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, rating, comment')
      .limit(1);
    
    if (reviewsError) {
      console.log('❌ Reviews table error:', reviewsError.message);
    } else {
      results.reviews = true;
      console.log('✅ Reviews table accessible');
    }

    // Test onboarding_data table
    console.log('7. Testing onboarding_data table...');
    const { data: onboardingData, error: onboardingError } = await supabase
      .from('onboarding_data')
      .select('id, user_id, dietary_preferences')
      .limit(1);
    
    if (onboardingError) {
      console.log('❌ Onboarding_data table error:', onboardingError.message);
    } else {
      results.onboarding_data = true;
      console.log('✅ Onboarding_data table accessible');
    }

    // Summary
    console.log('\n📊 Integration Test Results:');
    console.log('============================');
    
    Object.entries(results).forEach(([table, success]) => {
      const status = success ? '✅' : '❌';
      console.log(`${status} ${table}: ${success ? 'Working' : 'Failed'}`);
    });

    const allWorking = Object.values(results).every(r => r);
    console.log(`\n${allWorking ? '🎉 All tables accessible!' : '⚠️ Some tables need attention'}`);

    if (!allWorking) {
      console.log('\n🔧 Next Steps:');
      console.log('1. Check if all tables exist in your Supabase database');
      console.log('2. Verify table names match exactly');
      console.log('3. Check RLS policies are configured correctly');
      console.log('4. Ensure your Supabase connection is working');
    }

    return results;

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return results;
  }
};

/**
 * Test specific service integrations
 */
export const testServiceIntegrations = async () => {
  console.log('\n🧪 Testing Service Integrations...\n');

  try {
    // Test restaurant service
    console.log('1. Testing Restaurant Service...');
    const { restaurantService } = await import('./restaurant-service');
    const restaurants = await restaurantService.getAllRestaurants();
    console.log(`✅ Restaurant service: ${restaurants.length} restaurants found`);

    // Test countries service
    console.log('2. Testing Countries Service...');
    const { getCountries } = await import('./countries-service');
    const countries = await getCountries();
    console.log(`✅ Countries service: ${countries.length} countries found`);

    // Test dishes service
    console.log('3. Testing Dishes Service...');
    const { getAllDishes } = await import('./dishes-service');
    const dishes = await getAllDishes();
    console.log(`✅ Dishes service: ${dishes.length} dishes found`);

    console.log('\n🎉 All services working correctly!');

  } catch (error) {
    console.error('❌ Service integration test failed:', error);
  }
};

// Export for use in development
export default {
  testDatabaseIntegration,
  testServiceIntegrations
}; 