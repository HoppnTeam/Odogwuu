import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  backgroundColor: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'welcome',
    title: 'Welcome to Hoppn',
    subtitle: 'Your African Culinary Journey Begins',
    description: 'Discover authentic African dishes, learn their rich cultural stories, and support local restaurants in your community.',
    image: 'https://images.pexels.com/photos/5409020/pexels-photo-5409020.jpeg',
    backgroundColor: Colors.primary + '10',
  },
  {
    id: 'discover',
    title: 'Discover Authentic Flavors',
    subtitle: 'Explore Dishes from Across Africa',
    description: 'From Nigerian Jollof to Ethiopian Doro Wat, explore traditional recipes and learn about their origins and cultural significance.',
    image: 'https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg',
    backgroundColor: Colors.secondary + '10',
  },
  {
    id: 'support',
    title: 'Support Local Restaurants',
    subtitle: 'Easy Pickup, No Delivery Hassles',
    description: 'Order ahead and pick up your food when it\'s ready. Support African restaurants in your community with convenient pickup options.',
    image: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg',
    backgroundColor: Colors.accent + '10',
  },
  {
    id: 'cultural',
    title: 'Learn Cultural Stories',
    subtitle: 'Every Dish Has a Story',
    description: 'Dive deep into the history, preparation methods, and cultural significance of each dish. Become a connoisseur of African cuisine.',
    image: 'https://images.pexels.com/photos/5737244/pexels-photo-5737244.jpeg',
    backgroundColor: Colors.success + '10',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      // Navigate to main app
      router.replace('/');
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace('/');
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: slide.image }} style={styles.slideImage} />
        <View style={styles.imageOverlay} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingSlides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentSlide && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingSlides.map(renderSlide)}
      </ScrollView>

      {/* Pagination */}
      {renderPagination()}

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentSlide > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={styles.navButton}>
            <ChevronLeft color={Colors.text.secondary} size={24} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.navSpacer} />
        
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>
            {currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight color={Colors.text.inverse} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  skipButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  skipText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
  imageContainer: {
    flex: 0.6,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
  },
  contentContainer: {
    flex: 0.4,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    justifyContent: 'center',
  },
  slideTitle: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  slideSubtitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideDescription: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border.medium,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  navButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-SemiBold',
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },
  navSpacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.inverse,
    marginRight: Spacing.sm,
  },
});