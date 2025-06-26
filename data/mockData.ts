import { Restaurant, Dish, CountryInfo } from '@/types';

export const countries: CountryInfo[] = [
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    description: 'Home to diverse cuisines including Yoruba, Igbo, and Hausa traditions'
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    description: 'Known for rich stews, grilled meats, and flavorful spice blends'
  },
  {
    name: 'Liberia',
    flag: '🇱🇷',
    description: 'Unique blend of African and American influences in traditional cooking'
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    description: 'East African cuisine with Indian and Arab influences'
  },
  {
    name: 'Somalia',
    flag: '🇸🇴',
    description: 'Horn of Africa flavors with Italian and Arab culinary influences'
  },
  {
    name: 'Ethiopia',
    flag: '🇪🇹',
    description: 'Famous for injera bread and complex spice blends like berbere'
  },
  {
    name: 'Gambia',
    flag: '🇬🇲',
    description: 'West African coastal cuisine with rice-based dishes and fresh seafood'
  },
  {
    name: 'Senegal',
    flag: '🇸🇳',
    description: 'Renowned for thieboudienne and vibrant Wolof culinary traditions'
  },
  {
    name: 'Sudan',
    flag: '🇸🇩',
    description: 'North African cuisine blending Arab, African, and Mediterranean influences'
  },
  {
    name: 'Morocco',
    flag: '🇲🇦',
    description: 'North African cuisine with Berber, Arab, and Mediterranean influences'
  },
  {
    name: 'Togo',
    flag: '🇹🇬',
    description: 'West African flavors with French colonial culinary influences'
  },
  {
    name: 'Sierra Leone',
    flag: '🇸🇱',
    description: 'West African coastal cuisine with unique rice dishes and palm oil cooking'
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Mama Africa Kitchen',
    description: 'Authentic West African cuisine with traditional recipes passed down through generations',
    image_url: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg',
    cuisine_type: 'West African',
    rating: 4.8,
    pickup_time: '25-35 min',
    address: '1234 University Ave, Minneapolis, MN',
    latitude: 44.9778,
    longitude: -93.2650,
    is_open: true,
    opening_hours: '11:00 AM - 10:00 PM'
  },
  {
    id: '2',
    name: 'Ethiopian Spice House',
    description: 'Traditional Ethiopian dishes served on fresh injera bread',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    cuisine_type: 'East African',
    rating: 4.7,
    pickup_time: '30-40 min',
    address: '5678 Cedar Ave, Minneapolis, MN',
    latitude: 44.9537,
    longitude: -93.2473,
    is_open: true,
    opening_hours: '12:00 PM - 9:00 PM'
  },
  {
    id: '3',
    name: 'Cape Town Grill',
    description: 'South African braai and traditional dishes with a modern twist',
    image_url: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
    cuisine_type: 'South African',
    rating: 4.6,
    pickup_time: '35-45 min',
    address: '9012 Lyndale Ave, Minneapolis, MN',
    latitude: 44.9481,
    longitude: -93.2884,
    is_open: false,
    opening_hours: '5:00 PM - 11:00 PM'
  },
  {
    id: '4',
    name: 'Accra Street Food',
    description: 'Ghanaian street food favorites and traditional home cooking',
    image_url: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    cuisine_type: 'West African',
    rating: 4.9,
    pickup_time: '20-30 min',
    address: '3456 Hennepin Ave, Minneapolis, MN',
    latitude: 44.9633,
    longitude: -93.2683,
    is_open: true,
    opening_hours: '10:00 AM - 9:00 PM'
  },
  {
    id: '5',
    name: 'Dakar Delights',
    description: 'Senegalese cuisine featuring fresh seafood and traditional thieboudienne',
    image_url: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
    cuisine_type: 'West African',
    rating: 4.5,
    pickup_time: '25-35 min',
    address: '7890 Grand Ave, Minneapolis, MN',
    latitude: 44.9402,
    longitude: -93.1355,
    is_open: true,
    opening_hours: '11:30 AM - 9:30 PM'
  },
  {
    id: '6',
    name: 'Mogadishu Flavors',
    description: 'Authentic Somali cuisine with aromatic spices and traditional pasta dishes',
    image_url: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg',
    cuisine_type: 'East African',
    rating: 4.4,
    pickup_time: '20-30 min',
    address: '2468 Lake St, Minneapolis, MN',
    latitude: 44.9481,
    longitude: -93.2650,
    is_open: true,
    opening_hours: '12:00 PM - 10:00 PM'
  },
  {
    id: '7',
    name: 'Marrakech Express',
    description: 'North African tagines and couscous dishes with authentic Moroccan flavors',
    image_url: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    cuisine_type: 'North African',
    rating: 4.6,
    pickup_time: '30-40 min',
    address: '1357 Franklin Ave, Minneapolis, MN',
    latitude: 44.9633,
    longitude: -93.2884,
    is_open: true,
    opening_hours: '5:00 PM - 10:00 PM'
  },
  {
    id: '8',
    name: 'Nairobi Kitchen',
    description: 'Kenyan comfort food featuring ugali, nyama choma, and traditional vegetables',
    image_url: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg',
    cuisine_type: 'East African',
    rating: 4.3,
    pickup_time: '25-35 min',
    address: '9753 Nicollet Ave, Minneapolis, MN',
    latitude: 44.9537,
    longitude: -93.2473,
    is_open: false,
    opening_hours: '11:00 AM - 9:00 PM'
  }
];

export const mockDishes: Dish[] = [
  // West African Dishes
  {
    id: '1',
    restaurant_id: '1',
    name: 'Jollof Rice',
    description: 'Fragrant rice cooked in a rich tomato sauce with spices, served with grilled chicken',
    image_url: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    price: 16.99,
    category: 'Main Course',
    spice_level: 2,
    country_origin: 'Nigeria',
    country_flag: '🇳🇬',
    origin_story: 'Jollof rice is a beloved West African dish with origins dating back to the 14th century in the Senegambian region. Each country has perfected its own version, with Nigerian Jollof being known for its bold flavors and party rice tradition.',
    ingredients: ['Rice', 'Tomatoes', 'Onions', 'Bell peppers', 'Spices', 'Chicken stock'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 420,
    preparation_method: 'Rice is parboiled, then cooked in a rich tomato-based sauce with aromatic spices until perfectly tender and flavorful.',
    cultural_significance: 'Jollof rice is the centerpiece of celebrations, family gatherings, and special occasions across West Africa, symbolizing unity and shared heritage.',
    health_benefits: 'Rich in carbohydrates for energy, contains lycopene from tomatoes, and provides essential vitamins from bell peppers and onions.',
    native_regions: ['Lagos, Nigeria', 'Accra, Ghana', 'Dakar, Senegal', 'Freetown, Sierra Leone'],
    taste_profile: 'Savory and aromatic with a perfect balance of tomato richness, subtle heat from peppers, and fragrant spices that create a deeply satisfying flavor.'
  },
  {
    id: '2',
    restaurant_id: '1',
    name: 'Suya',
    description: 'Grilled spiced beef skewers with yaji spice blend and fresh vegetables',
    image_url: 'https://images.pexels.com/photos/5474045/pexels-photo-5474045.jpeg',
    price: 14.99,
    category: 'Appetizer',
    spice_level: 4,
    country_origin: 'Nigeria',
    country_flag: '🇳🇬',
    origin_story: 'Suya originated with the Hausa people of Northern Nigeria and has become a beloved street food across West Africa. The yaji spice blend, made from groundnuts and spices, gives suya its distinctive flavor and has been perfected over centuries.',
    ingredients: ['Beef', 'Groundnut powder', 'Chili pepper', 'Ginger', 'Garlic', 'Onions'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 220,
    preparation_method: 'Thin strips of beef are marinated in spices, skewered, and grilled over open flames, then coated with yaji spice blend.',
    cultural_significance: 'Suya represents the social aspect of Nigerian culture, often enjoyed in groups during evening gatherings and celebrations.',
    health_benefits: 'High in protein, contains healthy fats from groundnuts, and spices provide anti-inflammatory properties.',
    native_regions: ['Kano, Nigeria', 'Kaduna, Nigeria', 'Jos, Nigeria', 'Abuja, Nigeria'],
    taste_profile: 'Smoky and spicy with a nutty undertone from groundnut powder, balanced with aromatic spices that create an addictive flavor profile.'
  },
  {
    id: '3',
    restaurant_id: '4',
    name: 'Fufu',
    description: 'Traditional pounded cassava and yam served with rich palm nut soup',
    image_url: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg',
    price: 13.99,
    category: 'Main Course',
    spice_level: 2,
    country_origin: 'Ghana',
    country_flag: '🇬🇭',
    origin_story: 'Fufu has been a staple food in Ghana for over 1000 years, traditionally prepared by pounding boiled cassava and plantain in a wooden mortar. It represents the heart of Ghanaian cuisine and communal dining.',
    ingredients: ['Cassava', 'Plantain', 'Palm nuts', 'Fish', 'Meat', 'Vegetables'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 380,
    preparation_method: 'Boiled cassava and plantain are pounded until smooth and elastic, served with soup made from palm nuts, meat, and vegetables.',
    cultural_significance: 'Fufu eating is a communal activity that brings families together, representing unity and shared traditions in Ghanaian culture.',
    health_benefits: 'Rich in carbohydrates and fiber, provides essential vitamins from palm nuts, and offers complete proteins when served with meat or fish.',
    native_regions: ['Kumasi, Ghana', 'Accra, Ghana', 'Cape Coast, Ghana', 'Tamale, Ghana'],
    taste_profile: 'Mild and starchy with a smooth, elastic texture that perfectly complements the rich, savory flavors of the accompanying soup.'
  },
  {
    id: '4',
    restaurant_id: '4',
    name: 'Kelewele',
    description: 'Spiced fried plantains with ginger and pepper, served as a snack or side',
    image_url: 'https://images.pexels.com/photos/5940760/pexels-photo-5940760.jpeg',
    price: 8.99,
    category: 'Appetizer',
    spice_level: 3,
    country_origin: 'Ghana',
    country_flag: '🇬🇭',
    origin_story: 'Kelewele is a popular Ghanaian street food that originated in the northern regions. The combination of sweet plantains with fiery spices represents the perfect balance in Ghanaian cuisine - sweet, spicy, and deeply satisfying.',
    ingredients: ['Ripe plantains', 'Ginger', 'Chili pepper', 'Onions', 'Salt'],
    is_vegetarian: true,
    is_vegan: true,
    calories: 180,
    preparation_method: 'Ripe plantains are cubed, seasoned with ginger, chili, and spices, then deep-fried until golden and caramelized.',
    cultural_significance: 'Kelewele is enjoyed as a popular street snack and represents the vibrant street food culture of Ghana.',
    health_benefits: 'Rich in potassium and vitamin C from plantains, ginger provides digestive benefits and anti-inflammatory properties.',
    native_regions: ['Tamale, Ghana', 'Bolgatanga, Ghana', 'Wa, Ghana', 'Accra, Ghana'],
    taste_profile: 'Sweet and spicy with caramelized edges, the natural sweetness of plantains balanced by the heat of ginger and chili peppers.'
  },
  {
    id: '5',
    restaurant_id: '5',
    name: 'Thieboudienne',
    description: 'Senegalese national dish of fish and rice with vegetables in tomato sauce',
    image_url: 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg',
    price: 19.99,
    category: 'Main Course',
    spice_level: 2,
    country_origin: 'Senegal',
    country_flag: '🇸🇳',
    origin_story: 'Thieboudienne, meaning "rice and fish" in Wolof, was created in the 19th century in Saint-Louis, Senegal. It has become the national dish and represents the essence of Senegalese cuisine and hospitality.',
    ingredients: ['Fish', 'Rice', 'Tomatoes', 'Onions', 'Cabbage', 'Carrots', 'Okra'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 450,
    preparation_method: 'Fish is stuffed with herbs and fried, then cooked with vegetables in tomato sauce. Rice is cooked in the flavorful broth.',
    cultural_significance: 'Thieboudienne is the centerpiece of Senegalese family meals and represents the country\'s rich fishing heritage and communal dining traditions.',
    health_benefits: 'High in omega-3 fatty acids from fish, rich in vitamins from vegetables, and provides complex carbohydrates from rice.',
    native_regions: ['Saint-Louis, Senegal', 'Dakar, Senegal', 'Thiès, Senegal', 'Kaolack, Senegal'],
    taste_profile: 'Rich and savory with layers of flavor from the fish broth, sweet vegetables, and aromatic spices creating a harmonious and satisfying meal.'
  },

  // East African Dishes
  {
    id: '6',
    restaurant_id: '2',
    name: 'Doro Wat',
    description: 'Traditional Ethiopian chicken stew with berbere spice blend, served with injera',
    image_url: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg',
    price: 18.99,
    category: 'Main Course',
    spice_level: 4,
    country_origin: 'Ethiopia',
    country_flag: '🇪🇹',
    origin_story: 'Doro Wat is Ethiopia\'s national dish, traditionally served during special occasions and holidays. The complex berbere spice blend can contain up to 20 different spices, creating layers of flavor that represent the heart of Ethiopian cuisine.',
    ingredients: ['Chicken', 'Berbere spice', 'Onions', 'Garlic', 'Ginger', 'Hard-boiled eggs'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 380,
    preparation_method: 'Chicken is slow-cooked in a rich sauce made with berbere spice, onions, and aromatic spices until tender and flavorful.',
    cultural_significance: 'Doro Wat is the centerpiece of Ethiopian celebrations and represents the country\'s ancient culinary traditions and communal dining culture.',
    health_benefits: 'Rich in protein from chicken and eggs, berbere spices provide antioxidants and anti-inflammatory compounds.',
    native_regions: ['Addis Ababa, Ethiopia', 'Gondar, Ethiopia', 'Bahir Dar, Ethiopia', 'Dire Dawa, Ethiopia'],
    taste_profile: 'Complex and deeply spiced with layers of heat and flavor from berbere, balanced by the richness of slow-cooked chicken and aromatic vegetables.'
  },
  {
    id: '7',
    restaurant_id: '2',
    name: 'Injera',
    description: 'Traditional Ethiopian sourdough flatbread with a spongy texture',
    image_url: 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg',
    price: 4.99,
    category: 'Bread',
    spice_level: 0,
    country_origin: 'Ethiopia',
    country_flag: '🇪🇹',
    origin_story: 'Injera has been the foundation of Ethiopian cuisine for over 3,000 years. Made from teff, an ancient grain native to Ethiopia, it serves as both plate and utensil in traditional dining, symbolizing community and shared meals.',
    ingredients: ['Teff flour', 'Water'],
    is_vegetarian: true,
    is_vegan: true,
    calories: 85,
    preparation_method: 'Teff flour is fermented for several days to create a sourdough starter, then cooked on a clay plate called mitad.',
    cultural_significance: 'Injera represents the foundation of Ethiopian culture, used as both food and eating utensil, symbolizing unity and shared heritage.',
    health_benefits: 'Teff is rich in protein, fiber, and minerals including iron and calcium, and is naturally gluten-free.',
    native_regions: ['Tigray, Ethiopia', 'Amhara, Ethiopia', 'Oromia, Ethiopia', 'SNNPR, Ethiopia'],
    taste_profile: 'Mildly tangy and sour from fermentation with a unique spongy texture that perfectly absorbs the flavors of accompanying dishes.'
  },
  {
    id: '8',
    restaurant_id: '6',
    name: 'Beef Suqaar',
    description: 'Somali spiced beef stir-fry with onions, peppers, and aromatic spices',
    image_url: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    price: 17.99,
    category: 'Main Course',
    spice_level: 3,
    country_origin: 'Somalia',
    country_flag: '🇸🇴',
    origin_story: 'Suqaar reflects Somalia\'s position as a trading hub, incorporating spices from Arab and Indian merchants. This quick-cooking method preserves the meat\'s tenderness while infusing it with aromatic spices.',
    ingredients: ['Beef', 'Onions', 'Bell peppers', 'Cumin', 'Coriander', 'Cardamom'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 320,
    preparation_method: 'Tender beef is cut into small cubes and quickly stir-fried with onions, peppers, and a blend of aromatic spices.',
    cultural_significance: 'Suqaar represents the nomadic heritage of Somalia, where quick-cooking methods were essential for pastoral life.',
    health_benefits: 'High in protein and iron from beef, spices provide antioxidants and digestive benefits.',
    native_regions: ['Mogadishu, Somalia', 'Hargeisa, Somalia', 'Bosaso, Somalia', 'Kismayo, Somalia'],
    taste_profile: 'Tender and aromatic with warm spices, the beef remains juicy while absorbing the complex flavors of cumin, coriander, and cardamom.'
  },
  {
    id: '9',
    restaurant_id: '8',
    name: 'Ugali',
    description: 'Kenyan cornmeal staple served with sukuma wiki and nyama choma',
    image_url: 'https://images.pexels.com/photos/5940760/pexels-photo-5940760.jpeg',
    price: 11.99,
    category: 'Main Course',
    spice_level: 1,
    country_origin: 'Kenya',
    country_flag: '🇰🇪',
    origin_story: 'Ugali became a staple food in Kenya during the colonial period when maize was introduced. It has since become the foundation of Kenyan cuisine, representing sustenance and community.',
    ingredients: ['White cornmeal', 'Water', 'Salt'],
    is_vegetarian: true,
    is_vegan: true,
    calories: 180,
    preparation_method: 'Cornmeal is gradually added to boiling water while stirring continuously until it forms a thick, smooth consistency.',
    cultural_significance: 'Ugali is the foundation of Kenyan meals, representing unity and shared heritage across different ethnic groups.',
    health_benefits: 'Provides complex carbohydrates for sustained energy and is naturally gluten-free.',
    native_regions: ['Nairobi, Kenya', 'Mombasa, Kenya', 'Kisumu, Kenya', 'Nakuru, Kenya'],
    taste_profile: 'Mild and neutral with a firm, smooth texture that serves as the perfect base for absorbing flavors from accompanying dishes.'
  },

  // North African Dishes
  {
    id: '10',
    restaurant_id: '7',
    name: 'Tagine',
    description: 'Slow-cooked Moroccan lamb with apricots, almonds, and aromatic spices',
    image_url: 'https://images.pexels.com/photos/4871011/pexels-photo-4871011.jpeg',
    price: 22.99,
    category: 'Main Course',
    spice_level: 2,
    country_origin: 'Morocco',
    country_flag: '🇲🇦',
    origin_story: 'The tagine cooking method dates back to the 9th century in Morocco. The conical clay pot allows steam to circulate and condense, creating tender, flavorful dishes that represent the essence of Moroccan cuisine.',
    ingredients: ['Lamb', 'Dried apricots', 'Almonds', 'Onions', 'Cinnamon', 'Ginger'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 420,
    preparation_method: 'Lamb is slow-cooked in a traditional tagine pot with fruits, nuts, and spices, allowing flavors to meld and intensify.',
    cultural_significance: 'Tagine represents the heart of Moroccan hospitality and the country\'s rich Berber and Arab culinary heritage.',
    health_benefits: 'Rich in protein from lamb, antioxidants from spices, and healthy fats from almonds.',
    native_regions: ['Marrakech, Morocco', 'Fez, Morocco', 'Casablanca, Morocco', 'Rabat, Morocco'],
    taste_profile: 'Sweet and savory with tender lamb, the natural sweetness of apricots balanced by warm spices and the crunch of almonds.'
  },

  // Additional dishes from the comprehensive list
  {
    id: '11',
    restaurant_id: '1',
    name: 'Egusi Soup',
    description: 'Nigerian soup made with ground melon seeds, leafy vegetables, and meat',
    image_url: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg',
    price: 15.99,
    category: 'Main Course',
    spice_level: 3,
    country_origin: 'Nigeria',
    country_flag: '🇳🇬',
    origin_story: 'Egusi soup has been a cornerstone of Nigerian cuisine for centuries, particularly among the Yoruba people. The ground melon seeds create a rich, nutritious base that has sustained families for generations.',
    ingredients: ['Ground melon seeds', 'Spinach', 'Beef', 'Fish', 'Palm oil', 'Onions'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 380,
    preparation_method: 'Ground melon seeds are cooked with palm oil, meat, fish, and leafy vegetables to create a thick, nutritious soup.',
    cultural_significance: 'Egusi soup is a symbol of Nigerian hospitality and represents the country\'s agricultural heritage and communal dining traditions.',
    health_benefits: 'Rich in protein from melon seeds, high in vitamins from leafy greens, and provides healthy fats from palm oil.',
    native_regions: ['Lagos, Nigeria', 'Ibadan, Nigeria', 'Abeokuta, Nigeria', 'Ilorin, Nigeria'],
    taste_profile: 'Rich and hearty with a nutty flavor from melon seeds, complemented by the earthiness of leafy greens and the richness of palm oil.'
  },
  {
    id: '12',
    restaurant_id: '5',
    name: 'Yassa',
    description: 'Senegalese lemon-marinated chicken with caramelized onions and mustard',
    image_url: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    price: 18.99,
    category: 'Main Course',
    spice_level: 2,
    country_origin: 'Senegal',
    country_flag: '🇸🇳',
    origin_story: 'Yassa originated in the Casamance region of Senegal and reflects the country\'s French colonial influence combined with traditional West African cooking methods.',
    ingredients: ['Chicken', 'Lemons', 'Onions', 'Mustard', 'Garlic', 'Bay leaves'],
    is_vegetarian: false,
    is_vegan: false,
    calories: 350,
    preparation_method: 'Chicken is marinated in lemon juice and spices, then grilled and served with caramelized onions in a tangy sauce.',
    cultural_significance: 'Yassa represents the fusion of cultures in Senegal and is often served at special occasions and family gatherings.',
    health_benefits: 'High in protein from chicken, vitamin C from lemons, and antioxidants from onions and garlic.',
    native_regions: ['Ziguinchor, Senegal', 'Dakar, Senegal', 'Thiès, Senegal', 'Kaolack, Senegal'],
    taste_profile: 'Tangy and savory with bright citrus notes from lemon, balanced by sweet caramelized onions and aromatic spices.'
  }
];

export const getDishesByRestaurant = (restaurantId: string): Dish[] => {
  return mockDishes.filter(dish => dish.restaurant_id === restaurantId);
};

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return mockRestaurants.find(restaurant => restaurant.id === id);
};

export const getDishById = (id: string): Dish | undefined => {
  return mockDishes.find(dish => dish.id === id);
};