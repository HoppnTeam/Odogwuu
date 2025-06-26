# Hoppn Database Setup Guide

This guide will help you set up the Hoppn database with all the necessary tables, data, and configurations for the African food ordering mobile app.

## Architecture Overview

Hoppn uses a **curated dish model** for the mobile app:
- **Hoppn** provides a curated list of authentic African dishes
- **Mobile app** displays these dishes organized by country
- **Customers** browse and learn about authentic African cuisine
- **Future**: Vendors will be able to customize these dishes (not implemented yet)

## Database Schema

### Core Tables for Mobile App
1. **countries** - African countries with cultural information
2. **dishes** - Hoppn-curated authentic African dishes
3. **users** - Customer accounts
4. **orders** - Pickup orders (future)
5. **reviews** - Customer reviews (future)

## Setup Instructions

### 1. Run Schema Setup
```sql
-- Run the complete schema file
-- This creates all tables, indexes, RLS policies, and functions
```

### 2. Insert Countries Data
```sql
-- Run countries_data.sql to insert 12 African countries
-- Each country includes cultural information and regional categorization
```

### 3. Insert Hoppn Curated Dishes
```sql
-- Run dishes_data.sql to insert 12 authentic African dishes
-- These are the dishes that customers can browse in the mobile app
```

## Data Structure

### Countries (12 countries)
- **West African**: Nigeria, Ghana, Senegal
- **East African**: Ethiopia, Somalia, Kenya  
- **North African**: Morocco
- **South African**: South Africa, Zimbabwe, Botswana
- **Central African**: Cameroon, Chad

Each country includes:
- Cultural description
- Regional categorization
- Display order for UI

### Hoppn Curated Dishes (12 dishes)
- **Nigeria**: Jollof Rice, Suya, Egusi Soup
- **Ghana**: Fufu, Kelewele
- **Senegal**: Thieboudienne, Yassa
- **Ethiopia**: Doro Wat, Injera
- **Somalia**: Beef Suqaar
- **Kenya**: Ugali
- **Morocco**: Tagine

Each dish includes:
- Rich cultural story and origin
- Base ingredients and preparation method
- Cultural significance and health benefits
- Taste profile and native regions
- Base pricing and spice levels

## Mobile App Features

### Discovery Screen
- Browse dishes by country using `get_dishes_by_country()`
- View featured dishes using `get_featured_dishes()`
- Learn about African cultures through dish stories

### Country Detail Screen
- View all dishes from a specific country
- Read cultural stories and significance
- See ingredients and preparation methods

### Cultural Education
- Each dish includes rich cultural context
- Historical origins and significance
- Health benefits and traditional preparation
- Regional variations and native regions

## Verification Queries

### Check Countries
```sql
SELECT name, region, flag, description 
FROM countries 
ORDER BY display_order;
```

### Check Hoppn Dishes
```sql
SELECT name, country_origin, base_price, base_spice_level, category
FROM dishes 
WHERE is_active = true
ORDER BY country_origin, name;
```

### Check Dishes by Country
```sql
SELECT * FROM get_dishes_by_country('Nigeria');
```

### Check Featured Dishes
```sql
SELECT * FROM get_featured_dishes();
```

## Mobile App Integration

### Current Features
- **Country Browsing**: Browse dishes organized by African countries
- **Cultural Education**: Rich stories and context for each dish
- **Discovery**: Explore authentic African cuisine
- **Featured Dishes**: Curated selection for the Discovery screen

### Future Features (Not Implemented Yet)
- **Ordering**: Place pickup orders
- **Vendor Integration**: Vendors customize Hoppn dishes
- **Reviews**: Customer reviews and ratings
- **User Profiles**: Dietary preferences and spice tolerance

## Business Benefits

### For Hoppn
- **Quality Control**: Ensures authentic African cuisine
- **Cultural Education**: Rich stories and context for customers
- **Consistency**: Standardized dish information
- **Scalability**: Easy to add new dishes and countries

### For Customers
- **Cultural Education**: Learn about African cuisine and heritage
- **Authenticity**: Verified authentic African recipes
- **Discovery**: Explore diverse African cuisines
- **Educational Value**: Rich cultural context with each dish

## Next Steps

1. **Run all SQL scripts** in order (schema → countries → dishes)
2. **Test the functions** with verification queries
3. **Update mobile app** to use new dish structure
4. **Test Discovery screen** with real data from Supabase
5. **Future**: Add ordering, vendor integration, and reviews

## Support

For questions about the database setup or mobile app integration, refer to the schema files or contact the development team. 