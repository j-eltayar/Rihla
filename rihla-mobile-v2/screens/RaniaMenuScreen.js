import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions, FlatList } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const CAROUSEL_IMAGES = [
  require('../assets/carousel/IMG_5876.jpg'),
  require('../assets/carousel/106_1253.jpeg'),
  require('../assets/carousel/c8f58234-1c3d-45cc-befe-8e815cf87139.jpg'),
  require('../assets/carousel/IMG_3126.jpg'),
  require('../assets/carousel/104_1066.jpeg'),
  require('../assets/carousel/IMG_7234.jpg'),
  require('../assets/carousel/8e19b327-c444-4689-9e0d-10dabb1690d4.jpg'),
  require('../assets/carousel/IMG_5857.jpg'),
  require('../assets/carousel/106_1284.jpeg'),
  require('../assets/carousel/IMG_3129.jpg'),
  require('../assets/carousel/IMG_5862.jpg'),
];

export default function RaniaMenuScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const menuItems = [
    {
      id: 'whyILoveYou',
      title: 'Why I Love You',
      emoji: '💕',
      description: 'Discover all the reasons',
      color: '#F5E6E8',
      onPress: () => navigation.navigate('WhyILoveYou'),
    },
    {
      id: 'messages',
      title: 'Messages From Me',
      emoji: '💌',
      description: 'Little notes just for you',
      color: '#E8E3F0',
      onPress: () => navigation.navigate('Messages'),
    },
    {
      id: 'cfaprep',
      title: 'CFA Prep',
      emoji: '📚',
      description: 'Study materials and resources',
      color: '#E8F0E3',
      onPress: () => navigation.navigate('CFAPrep'),
    },
    {
      id: 'yourFaults',
      title: 'Your Faults',
      emoji: '🥰',
      description: 'Self explnanatory :)',
      color: '#FFF0E6',
      onPress: () => navigation.navigate('YourFaults'),
    },
    {
      id: 'hardDay',
      title: 'For a Hard Day',
      emoji: '🤗',
      description: 'When you need a little comfort',
      color: '#E3F0FF',
      onPress: () => navigation.navigate('HardDay'),
    },
  ];

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % CAROUSEL_IMAGES.length;
        flatListRef.current?.scrollToOffset({
          offset: nextIndex * (screenWidth - 48),
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderCarouselItem = ({ item, index }) => (
    <View style={styles.carouselItem}>
      <Image source={item} style={styles.carouselImage} resizeMode="cover" />
    </View>
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>For Rania 💖</Text>
        <Text style={styles.subtitle}>What would you like to explore?</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={CAROUSEL_IMAGES}
            renderItem={renderCarouselItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            snapToInterval={screenWidth - 48}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          />
          <View style={styles.dotsContainer}>
            {CAROUSEL_IMAGES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
          <View style={styles.photoOverlay}>
            <Text style={styles.photoText}>JTM 💕</Text>
          </View>
        </View>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuCard, { backgroundColor: item.color }]}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuCardContent}>
              <View style={styles.menuCardLeft}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8a8a8a',
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  arrow: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  carouselContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    height: 300,
    backgroundColor: '#000',
  },
  carouselContent: {
    alignItems: 'center',
  },
  carouselItem: {
    width: screenWidth - 48,
    height: 300,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 24,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
    alignItems: 'center',
  },
  photoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
