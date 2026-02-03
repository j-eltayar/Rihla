import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Dimensions, Modal } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function MoroccoScreen({ navigation }) {
  const [geographyIndex, setGeographyIndex] = useState(0);
  const [funFactsIndex, setFunFactsIndex] = useState(0);
  const [famousIndex, setFamousIndex] = useState(0);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  const geographyData = [
    {
      id: 1,
      name: 'Marrakech',
      emoji: '🕌',
      title: 'The Red City',
      description: 'The vibrant heart of Morocco, where ancient souks meet modern luxury.',
      highlights: 'Jemaa el-Fnaa • Majorelle Garden • Bahia Palace',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Chefchaouen',
      emoji: '💙',
      title: 'The Blue Pearl',
      description: 'A dreamlike mountain town painted in shades of blue and white.',
      highlights: 'Blue Medina • Ras El Maa • Spanish Mosque',
      color: '#4FC3F7'
    },
    {
      id: 3,
      name: 'Sahara Desert',
      emoji: '🏜️',
      title: 'The Golden Infinity',
      description: 'Endless waves of golden sand where earth meets sky. The MOROCCAN Western Sahara',
      highlights: 'Erg Chebbi • Camel Treks • Starlit Nights',
      color: '#FFB74D'
    },
    {
      id: 4,
      name: 'Fes',
      emoji: '📚',
      title: 'The Cultural Capital',
      description: 'Home to the world\'s oldest university and most authentic medina.',
      highlights: 'Al-Qarawiyyin • Chouara Tannery • Blue Gate',
      color: '#9C27B0'
    },
    {
      id: 5,
      name: 'Casablanca',
      emoji: '🌊',
      title: 'The Modern Jewel',
      description: 'Where Morocco meets the Atlantic with cosmopolitan flair.',
      highlights: 'Hassan II Mosque • Corniche • Rick\'s Café',
      color: '#00BCD4'
    },
    {
      id: 6,
      name: 'Atlas Mountains',
      emoji: '⛰️',
      title: 'The Majestic Peaks',
      description: 'Snow-capped peaks towering over Berber villages.',
      highlights: 'Mount Toubkal • Berber Villages • Imlil Valley',
      color: '#8BC34A'
    }
  ];

  const funFactsData = [
    {
      id: 1,
      emoji: '🎬',
      title: 'Hollywood of Africa',
      fact: 'Morocco has been the backdrop for hundreds of films including Gladiator, Lawrence of Arabia, and The Mummy. Ouarzazate is known as the "Hollywood of Africa"!',
      color: '#FF6B6B'
    },
    {
      id: 2,
      emoji: '🕌',
      title: 'Oldest University',
      fact: 'The University of Al Quaraouiyine in Fes, founded in 859 AD by Fatima al-Fihri, is the oldest continuously operating university in the world!',
      color: '#9C27B0'
    },
    {
      id: 3,
      emoji: '☕',
      title: 'Mint Tea Ritual',
      fact: 'Moroccan mint tea is served from a height to create foam. Refusing three cups is considered impolite - it\'s a sacred ritual of hospitality!',
      color: '#4CAF50'
    },
    {
      id: 4,
      emoji: '🐪',
      title: 'Goats in Trees',
      fact: 'Morocco is famous for its tree-climbing goats! They climb argan trees to eat the fruit, and their droppings help produce valuable argan oil.',
      color: '#FFB74D'
    },
    {
      id: 5,
      emoji: '🎨',
      title: 'Zellige Art',
      fact: 'Moroccan zellige tilework is over 1,000 years old. Each intricate geometric pattern is cut by hand and assembled like a puzzle - no two are exactly alike!',
      color: '#00BCD4'
    },
    {
      id: 6,
      emoji: '🌍',
      title: 'Gateway to Africa',
      fact: 'Morocco is only 8 miles from Europe across the Strait of Gibraltar. It\'s the perfect blend of African, Arab, and European cultures!',
      color: '#E91E63'
    },
    {
      id: 7,
      emoji: '🌙',
      title: 'Star Wars Connection',
      fact: 'Many Star Wars scenes were filmed in Morocco! The planet Tatooine was actually filmed in Matmata and the Sahara Desert.',
      color: '#7E57C2'
    },
    {
      id: 8,
      emoji: '🏺',
      title: 'Ancient Souks',
      fact: 'Moroccan souks have operated continuously for over 1,000 years. They\'re living museums where ancient trading traditions thrive today!',
      color: '#FF9800'
    }
  ];

  const famousMoroccansData = [
    {
      id: 1,
      name: 'Ibn Battuta',
      emoji: '🗺️',
      title: 'Greatest Explorer',
      achievement: 'Traveled over 75,000 miles across the medieval world (1325-1354), visiting the equivalent of 44 modern countries. His journeys make Marco Polo look like a homebody!',
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Fatima al-Fihri',
      emoji: '📚',
      title: 'Education Pioneer',
      achievement: 'Founded the world\'s first university (Al-Qarawiyyin) in 859 AD. A Muslim woman who revolutionized education and influenced scholars for over 1,000 years!',
      color: '#9C27B0'
    },
    {
      id: 3,
      name: 'King Mohammed VI',
      emoji: '👑',
      title: 'Modern Reformer',
      achievement: 'Led Morocco\'s modernization with women\'s rights reforms, economic development, and making Morocco a model of stability and progress in the region.',
      color: '#4CAF50'
    },
    {
      id: 4,
      name: 'Achraf Hakimi',
      emoji: '⚽',
      title: 'Football Superstar',
      achievement: 'Led Morocco to become the first African and Arab nation to reach World Cup semifinals (2022). One of the world\'s best defenders at PSG!',
      color: '#00BCD4'
    },
    {
      id: 5,
      name: 'Gad Elmaleh',
      emoji: '🎭',
      title: 'Comedy Legend',
      achievement: 'Morocco\'s most famous comedian, sold out Madison Square Garden and became a French comedy icon. Netflix specials in both French and English!',
      color: '#FFB74D'
    },
    {
      id: 6,
      name: 'Nawal El Moutawakel',
      emoji: '🏅',
      title: 'Olympic Pioneer',
      achievement: 'First Muslim woman to win Olympic gold (1984). First woman from any Muslim-majority country to win Olympic gold. Broke barriers for all Arab women!',
      color: '#E91E63'
    },
    {
      id: 7,
      name: 'Yves Saint Laurent',
      emoji: '👗',
      title: 'Fashion Icon',
      achievement: 'Though French, he fell in love with Morocco and lived in Marrakech. His famous Majorelle Garden is now a symbol of Morocco\'s artistic soul.',
      color: '#7E57C2'
    },
    {
      id: 8,
      name: 'Leila Slimani',
      emoji: '✍️',
      title: 'Literary Star',
      achievement: 'Won France\'s prestigious Prix Goncourt (2016) for her novel "Chanson Douce". One of the most celebrated contemporary French-Moroccan authors.',
      color: '#FF9800'
    }
  ];

  const rotateCard = (currentIndex, setIndex, dataLength, direction) => {
    if (direction === 'next') {
      setIndex((currentIndex + 1) % dataLength);
    } else {
      setIndex((currentIndex - 1 + dataLength) % dataLength);
    }
  };

  const renderCarouselCard = (data, currentIndex, title, color) => {
    const card = data[currentIndex];
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    const nextIndex = (currentIndex + 1) % data.length;
    const prevCard = data[prevIndex];
    const nextCard = data[nextIndex];
    
    return (
      <View style={styles.carouselSection}>
        <Text style={styles.sectionTitle}>{title}</Text>
        
        <View style={styles.carouselContainer}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => rotateCard(currentIndex, 
              title === '🗺️ Geography' ? setGeographyIndex : 
              title === '✨ Fun Facts' ? setFunFactsIndex : setFamousIndex,
              data.length, 'prev')}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>

          {/* Left peek card */}
          <View style={[styles.peekCard, styles.leftPeek, { backgroundColor: prevCard.color }]}>
            <Text style={styles.peekEmoji}>{prevCard.emoji}</Text>
          </View>

          {/* Main card */}
          <View style={[styles.card, { backgroundColor: card.color }]}>
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{card.emoji}</Text>
              <Text style={styles.cardName} numberOfLines={1}>{card.name || card.title}</Text>
              {card.title && !card.name && <Text style={styles.cardTitle} numberOfLines={1}>{card.fact ? '' : card.title}</Text>}
              {card.title && card.name && <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>}
              <ScrollView 
                style={styles.cardDescriptionScroll}
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <Text style={styles.cardDescription}>
                  {card.description || card.fact || card.achievement}
                </Text>
                {card.highlights && (
                  <Text style={styles.cardHighlights}>{card.highlights}</Text>
                )}
              </ScrollView>
            </View>
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>
                {currentIndex + 1} / {data.length}
              </Text>
            </View>
          </View>

          {/* Right peek card */}
          <View style={[styles.peekCard, styles.rightPeek, { backgroundColor: nextCard.color }]}>
            <Text style={styles.peekEmoji}>{nextCard.emoji}</Text>
          </View>

          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => rotateCard(currentIndex,
              title === '🗺️ Geography' ? setGeographyIndex : 
              title === '✨ Fun Facts' ? setFunFactsIndex : setFamousIndex,
              data.length, 'next')}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dotsContainer}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.activeDot,
                { backgroundColor: index === currentIndex ? card.color : '#D0D0D0' }
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Morocco 🇲🇦</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🇲🇦</Text>
          <Text style={styles.heroTitle}>Welcome to Morocco</Text>
          <Text style={styles.heroSubtitle}>
            The land of breathtaking beauty, rich culture, and incredible people.
            Swipe through the amazing parts of your home country! 
            Here are the many reasons why Morocco is so special.
          </Text>
        </View>

        {renderCarouselCard(geographyData, geographyIndex, '🗺️ Geography', '#FF6B6B')}
        {renderCarouselCard(funFactsData, funFactsIndex, '✨ Fun Facts', '#4CAF50')}
        {renderCarouselCard(famousMoroccansData, famousIndex, '🌟 Famous Moroccans', '#9C27B0')}

        <TouchableOpacity 
          style={styles.secretCard}
          onPress={() => setShowSecretModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.secretEmoji}>🤫</Text>
          <Text style={styles.secretTitle}>Secret Reason</Text>
          <Text style={styles.secretHint}>Tap to reveal...</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showSecretModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSecretModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🇲🇦✨</Text>
            <Text style={styles.modalTitle}>The Greatest Part of Morocco</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalMessage}>
              The greatest part of Morocco is that it created someone like you.
            </Text>
            <Text style={styles.modalSubMessage}>
              All the beauty, culture, and magic of Morocco crammed into a single person - you. 💖
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSecretModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWelcomeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowWelcomeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.welcomeModalContent}>
            <Text style={styles.welcomeEmoji}>🇲🇦💕</Text>
            <Text style={styles.welcomeTitle}>A Message for You</Text>
            <View style={styles.modalDivider} />
            
            <Text style={styles.welcomeMessage}>
              I know we couldn't visit Morocco together, and I know how much your country means to you. 
            </Text>
            
            <Text style={styles.welcomeMessage}>
              I also how you've felt about how people view your beautiful country lately, and that weighs heavy on your heart.
            </Text>
            
            <Text style={styles.welcomeMessageHighlight}>
              But here's what I want you to remember:
            </Text>
            
            <Text style={styles.welcomeMessage}>
              Morocco is extraordinary. Its beauty, culture, history, and people are undeniable. Nothing anyone says can change the truth of how incredible your homeland is.
            </Text>
            
            <Text style={styles.welcomeMessage}>
              I made this section to remind you of all the reasons Morocco and you are so special. We'll visit together one day, Until then enjoy what I've learned about your country as I've looked into it. 💖
            </Text>
            
            <TouchableOpacity
              style={styles.welcomeButton}
              onPress={() => setShowWelcomeModal(false)}
            >
              <Text style={styles.welcomeButtonText}>Explore Morocco ✨</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 12,
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: '#E91E63',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  heroCard: {
    margin: 20,
    marginBottom: 10,
    padding: 32,
    backgroundColor: '#FFF5F5',
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE0E0',
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  carouselSection: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  arrowButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#E91E63',
    fontWeight: '700',
  },
  peekCard: {
    width: 40,
    height: 350,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  leftPeek: {
    marginRight: 10,
    transform: [{ rotateY: '-15deg' }],
  },
  rightPeek: {
    marginLeft: 10,
    transform: [{ rotateY: '15deg' }],
  },
  peekEmoji: {
    fontSize: 40,
  },
  card: {
    width: screenWidth - 200,
    height: 350,
    marginHorizontal: 0,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 5,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.95,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardDescriptionScroll: {
    flex: 1,
    width: '100%',
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.9,
  },
  cardHighlights: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.85,
    fontStyle: 'italic',
  },
  counterContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  secretCard: {
    margin: 20,
    marginTop: 30,
    marginBottom: 10,
    padding: 32,
    backgroundColor: '#FFF9E6',
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secretEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  secretTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#B8860B',
    marginBottom: 8,
    textAlign: 'center',
  },
  secretHint: {
    fontSize: 14,
    color: '#D4AF37',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footerCard: {
    margin: 20,
    marginTop: 10,
    marginBottom: 40,
    padding: 24,
    backgroundColor: '#F3E5F5',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E1BEE7',
  },
  footerText: {
    fontSize: 16,
    color: '#6A1B9A',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 36,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
  },
  modalSubMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  welcomeModalContent: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    maxHeight: '85%',
  },
  welcomeEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#C62828',
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  welcomeMessageHighlight: {
    fontSize: 17,
    fontWeight: '700',
    color: '#E91E63',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    marginTop: 8,
  },
  welcomeButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 12,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
