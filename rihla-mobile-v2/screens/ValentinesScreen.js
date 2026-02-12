import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image, FlatList } from 'react-native';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

export default function ValentinesScreen({ navigation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [isValentinesDay, setIsValentinesDay] = useState(false);

  // Check if it's Valentine's Day or after in Dubai timezone (UTC+4)
  useEffect(() => {
    const checkDate = () => {
      const now = new Date();
      
      // Get Dubai time offset (UTC+4 = 240 minutes)
      const dubaiOffset = 4 * 60; // minutes
      const localOffset = now.getTimezoneOffset(); // minutes from UTC
      const totalOffset = dubaiOffset + localOffset; // total difference in minutes
      
      // Create Dubai time
      const dubaiTime = new Date(now.getTime() + totalOffset * 60 * 1000);
      
      // Valentine's Day 2026 at midnight Dubai time
      const valentinesThisYear = new Date(2026, 1, 14, 0, 0, 0, 0); // Feb 14, 2026
      
      if (dubaiTime >= valentinesThisYear) {
        setIsValentinesDay(true);
      } else {
        // Calculate countdown
        const diff = valentinesThisYear - dubaiTime;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const valentinesCards = [
    {
      id: 1,
      emoji: '💕',
      title: 'My Valentine',
      message: "Every day with you feels like Valentine's Day, but today is extra special. You make my heart skip a beat.",
    },
    {
      id: 2,
      emoji: '🌹',
      title: 'Roses Are Red',
      message: "Roses are red,\nViolets are blue,\nNo poem could capture\nHow much I love you.\n\nYou're the light in my darkest days,\nThe warmth in my coldest nights,\nAnd the love of my life. ❤️",
      hasCarousel: true,
    },
    {
      id: 3,
      emoji: '💑',
      title: 'Our Story',
      message: "From the moment we met, I knew you were special. Every laugh, every adventure, every quiet moment together has been a treasure. Here's to our love story continuing forever.",
      hasVideo: true,
    },
    {
      id: 4,
      emoji: '💖',
      title: 'You Make Me Better',
      message: "You inspire me to be the best version of myself. Your love, support, and belief in me mean everything. Thank you for being my partner, my best friend, and my Valentine.",
      hasImage: true,
    },
    {
      id: 5,
      emoji: '🎁',
      title: 'My Gift To You',
      message: "The greatest gift I can give you is my heart, which has been yours from the start. But I promise to also give you endless love, laughter, support, and all the little moments that make life beautiful.",
    },
    {
      id: 6,
      emoji: '💝',
      title: 'Forever Yours',
      message: "Today, tomorrow, and always. I'm yours. Through every season, every challenge, every celebration. You're my forever Valentine, and I wouldn't want it any other way.",
    },
  ];

  const flowerImages = [
    require('../assets/flowers/PHOTO-2025-11-17-22-49-43.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-43.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-43_1.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-43_2.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-44.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-44_1.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-44_2.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-44_3.jpg'),
    require('../assets/flowers/PHOTO-2025-11-17-22-50-44_4.jpg'),
  ];

  const renderCarouselItem = ({ item }) => (
    <Image source={item} style={styles.carouselImage} resizeMode="cover" />
  );

  const renderCard = (card) => (
    <View
      key={card.id}
      style={[
        styles.card,
        selectedCard === card.id && styles.cardSelected,
      ]}
    >
      <TouchableOpacity
        onPress={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
        activeOpacity={0.8}
        style={styles.cardHeader}
      >
        <Text style={styles.cardEmoji}>{card.emoji}</Text>
        <Text style={styles.cardTitle}>{card.title}</Text>
        {selectedCard !== card.id && (
          <Text style={styles.tapToReveal}>Tap to reveal 💕</Text>
        )}
      </TouchableOpacity>
      {selectedCard === card.id && (
        <View style={styles.cardMessageContainer}>
          <View style={styles.divider} />
          {card.hasVideo && (
            <Video
              source={require('../assets/valentinesvideo.mov')}
              style={styles.cardVideo}
              useNativeControls
              resizeMode="contain"
              isLooping
              shouldPlay
            />
          )}
          {card.hasImage && (
            <Image
              source={require('../assets/carousel/IMG_3129.jpg')}
              style={styles.cardImage}
              resizeMode="cover"
            />
          )}
          {card.hasCarousel && (
            <View style={styles.carouselContainer}>
              <FlatList
                data={flowerImages}
                renderItem={renderCarouselItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.carousel}
                onScroll={(event) => {
                  const slideIndex = Math.round(
                    event.nativeEvent.contentOffset.x / (screenWidth - 100)
                  );
                  setCarouselIndex(slideIndex);
                }}
                scrollEventThrottle={16}
              />
              <View style={styles.pagination}>
                {flowerImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === carouselIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
          <Text style={styles.cardMessage}>{card.message}</Text>
        </View>
      )}
    </View>
  );

  // Show countdown if before Valentine's Day
  if (!isValentinesDay) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Valentine's Day 💝</Text>
        </View>
        
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownEmoji}>💝🔒</Text>
          <Text style={styles.countdownTitle}>Coming Soon...</Text>
          <Text style={styles.countdownMessage}>
            This special surprise will be unlocked on Valentine's Day!
          </Text>
          <View style={styles.countdownBox}>
            <Text style={styles.countdownLabel}>Time Until Valentine's Day</Text>
            <Text style={styles.countdownTime}>{countdown}</Text>
          </View>
          <Text style={styles.countdownNote}>
            I can't wait to share something special with you 💕
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Happy Valentine's Day 💝</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Message */}
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>❤️</Text>
          <Text style={styles.heroTitle}>To My Valentine</Text>
          <Text style={styles.heroMessage}>
            Today is a celebration of us, of the love we share, the memories we've made, and the future we're building together. You are my heart, my home, and my everything.
          </Text>
          <Text style={styles.heroSignature}>With all my love,</Text>
          <Text style={styles.heroSignatureName}>James 💕</Text>
        </View>

        {/* Valentine's Cards */}
        <View style={styles.cardsContainer}>
          <Text style={styles.sectionTitle}>Messages for You 💌</Text>
          <Text style={styles.sectionSubtitle}>Tap each card to reveal a special message</Text>
          {valentinesCards.map(card => renderCard(card))}
        </View>

        {/* Bottom Message */}
        <View style={styles.bottomCard}>
          <Image 
            source={require('../assets/valentines.jpg')} 
            style={styles.bottomImage}
            resizeMode="cover"
          />
          <Text style={styles.bottomMessage}>
            Happy Valentine's Day, my love. Every moment with you is a gift, and I'm so grateful to call you mine. Here's to many more Valentine's Days together. 💕
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FF1744',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE6EB',
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroMessage: {
    fontSize: 17,
    color: '#444',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
  },
  heroSignature: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  heroSignatureName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
    marginTop: 4,
  },
  cardsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FFE6EB',
  },
  cardHeader: {
    alignItems: 'center',
    width: '100%',
  },
  cardSelected: {
    borderColor: '#FF1744',
    backgroundColor: '#FFF5F7',
    shadowColor: '#FF1744',
    shadowOpacity: 0.2,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 8,
    textAlign: 'center',
  },
  tapToReveal: {
    fontSize: 14,
    color: '#E91E63',
    fontStyle: 'italic',
    marginTop: 4,
  },
  cardMessageContainer: {
    width: '100%',
    marginTop: 12,
  },
  divider: {
    height: 2,
    backgroundColor: '#FFE6EB',
    marginVertical: 16,
    borderRadius: 1,
  },
  cardVideo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#000',
  },
  cardImage: {
    width: '100%',
    height: 350,
    borderRadius: 12,
    marginBottom: 16,
  },
  carouselContainer: {
    width: '100%',
    marginBottom: 16,
  },
  carousel: {
    width: '100%',
    height: 300,
  },
  carouselImage: {
    width: screenWidth - 100,
    height: 300,
    borderRadius: 12,
    marginRight: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFE6EB',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1744',
  },
  cardMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE6EB',
  },
  bottomImage: {
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: 20,
    marginBottom: 20,
  },
  bottomMessage: {
    fontSize: 17,
    color: '#444',
    textAlign: 'center',
    lineHeight: 26,
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  countdownEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  countdownTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  countdownMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  countdownBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE6EB',
    minWidth: 280,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
    textAlign: 'center',
  },
  countdownTime: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF1744',
    textAlign: 'center',
  },
  countdownNote: {
    fontSize: 16,
    color: '#E91E63',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
