import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Modal, Platform } from 'react-native';
import { useProgress } from '../contexts/ProgressContext';

export default function DetailScreen({ route, navigation }) {
  const { section } = route.params;
  const [fadeAnims, setFadeAnims] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(1);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { markSectionComplete, updateSectionProgress, completedSections, saveCheckedItems, getCheckedItems } = useProgress();
  const isAlreadyCompleted = completedSections.includes(section.id);

  // You can customize the reasons for each section here - now with descriptions
  const reasonsData = {
    smile: [
      { reason: "Your smile lights up my entire world", description: "Every time you smile, everything around me becomes brighter and more beautiful" },
      { reason: "It makes even the darkest days bright", description: "No matter how hard the day has been, seeing your smile makes everything okay" },
      { reason: "I fall in love with you all over again every time you smile", description: "Each smile feels like the first time I saw you, and my heart races the same way" },
      { reason: "Your smile is the most beautiful thing I've ever seen", description: "Nothing in this world compares to the beauty of your genuine, radiant smile" },
      { reason: "It makes my heart skip a beat every single time", description: "The effect you have on me never fades, no matter how many times I see it" },
    ],
    personality: [
      { reason: "You're the most genuine person I know", description: "Your authenticity is rare and precious in this world, with me and your friends" },
      { reason: "Your authenticity is incredibly attractive", description: "You're unapologetically yourself, and that confidence is magnetic" },
      { reason: "You make me want to be a better person", description: "Your example inspires me to grow and improve every day" },
      { reason: "Your energy is contagious and uplifting", description: "Being around you lifts my spirits and fills me with positivity, like seeing you dance when you listen to music" },
      { reason: "You're perfectly imperfect in every way", description: "Your quirks and flaws make you even more lovable and real, and I wouldn't change a thing about you" },
    ],
    laugh: [
      { reason: "Your laugh is my favorite sound in the world", description: "I could listen to you laugh for hours and never get tired of it even if it's at me" },
      { reason: "It's infectious and fills me with joy", description: "Your laughter spreads happiness to everyone around you, from my best days to my worst" },
      { reason: "I love making you laugh just to hear it", description: "Seeing you happy and hearing that laugh is my greatest achievement, even if it's at my terrible jokes" },
      { reason: "Your giggle makes everything better", description: "That little giggle of yours when you're excited can turn any moment into something special" },
      { reason: "It's pure happiness in audio form", description: "Your laugh is the soundtrack to all my best memories" },
    ],
    kindness: [
      { reason: "You have the most beautiful heart", description: "Your kindness radiates from within and touches everyone you meet" },
      { reason: "Your compassion for others inspires me", description: "The way you care for people shows the depth of your beautiful soul" },
      { reason: "You always know how to make people feel special", description: "You have a gift for making everyone feel seen and valued" },
      { reason: "Your empathy is one of your greatest strengths", description: "You truly understand and feel for others in a profound way" },
      { reason: "You make the world a better place just by being in it", description: "Your presence and kindness ripple out and create positive change" },
    ],
    intelligence: [
      { reason: "Your mind is absolutely fascinating", description: "The way you think and process the world captivates me endlessly" },
      { reason: "I love our deep conversations", description: "Talking with you about life, dreams, and ideas is one of my favorite things even when we disagree" },
      { reason: "You challenge me to think differently", description: "You open my mind to new perspectives and ways of seeing things, NVIDIA hate included" },
      { reason: "Your perspective on life is enlightening", description: "You see the world in unique and beautiful ways that amaze me" },
      { reason: "You're brilliant in ways you don't even realize", description: "Your intelligence shines through in everything you do" },
    ],
    beauty: [
      { reason: "You're absolutely breathtaking", description: "Every time I look at you, I'm struck by how lucky I am" },
      { reason: "Your eyes captured me the moment we met", description: "From the moment our eyes met, I knew you were special even if it was at baby" },
      { reason: "You glow from the inside out", description: "Your inner beauty radiates and makes you absolutely stunning" },
      { reason: "Every detail about you is perfect", description: "From your eyes to your smile to the way you move, everything is beautiful" },
      { reason: "You're the most beautiful person I've ever known", description: "Inside and out, you embody true beauty in every way" },
    ],
    heart: [
      { reason: "You love with your whole heart", description: "The way you love is complete, genuine, and all-encompassing" },
      { reason: "Your capacity for love amazes me", description: "The depth of love you're capable of giving is truly extraordinary" },
      { reason: "You make me feel safe and cherished", description: "In your love, I've found a home where I can truly be myself" },
      { reason: "Your love has transformed my life", description: "Loving you and being loved by you has changed me for the better" },
      { reason: "You're my home and my peace", description: "With you, I've found the place where my heart truly belongs" },
    ],
    everything: [
      { reason: "Every moment with you is a treasure", description: "I cherish each second we spend together, big or small" },
      { reason: "You complete me in ways I never knew were possible", description: "You fill spaces in my heart I didn't know existed" },
      { reason: "I can't imagine my life without you", description: "You've become such an essential part of who I am" },
      { reason: "You're my best friend", description: "You're the person I want to share everything with, forever" },
      { reason: "I fall more in love with you every single day", description: "My love for you grows deeper and stronger with each passing moment" },
      { reason: "You make me the happiest person alive", description: "The joy you bring into my life is beyond measure" },
      { reason: "Forever wouldn't be long enough with you", description: "I want to spend eternity loving you and being loved by you" },
    ],
  };

  const reasons = reasonsData[section.id] || [];
  const allCompleted = checkedItems.length === reasons.length && reasons.length > 0;

  // Mark section complete and show modal when all items are checked
  useEffect(() => {
    if (allCompleted && !isAlreadyCompleted) {
      // Mark the section as complete immediately
      markSectionComplete(section.id);
      // Then show the completion modal
      setTimeout(() => {
        setShowCompletionModal(true);
      }, 500);
    }
  }, [allCompleted, isAlreadyCompleted]);

  // Initialize animation values for each reason
  useEffect(() => {
    // Load saved checked items for this section
    const savedCheckedItems = getCheckedItems(section.id);
    setCheckedItems(savedCheckedItems);
    
    // Set visible count based on saved progress
    const newVisibleCount = savedCheckedItems.length > 0 ? savedCheckedItems.length + 1 : 1;
    const finalVisibleCount = Math.min(newVisibleCount, reasons.length);
    setVisibleCount(finalVisibleCount);
    
    // Update progress
    updateSectionProgress(section.id, savedCheckedItems.length, reasons.length);
    
    // Create animation values for all visible reasons (already loaded, so no animation needed)
    const anims = reasons.slice(0, finalVisibleCount).map((_, index) => ({
      opacity: new Animated.Value(1), // Start visible for already loaded items
      translateX: new Animated.Value(0), // No translation for already loaded items
    }));
    
    setFadeAnims(anims);
  }, [section.id]);

  const handleCheck = (index) => {
    // Mark item as checked
    const newCheckedItems = [...checkedItems, index];
    setCheckedItems(newCheckedItems);
    
    // Save checked items
    saveCheckedItems(section.id, newCheckedItems);
    
    // Update progress
    updateSectionProgress(section.id, newCheckedItems.length, reasons.length);
    
    // Reveal next item if available
    if (index + 1 < reasons.length && visibleCount === index + 1) {
      setVisibleCount(visibleCount + 1);
      
      // Create and animate the next item
      const newAnim = {
        opacity: new Animated.Value(0),
        translateX: new Animated.Value((index + 1) % 2 === 0 ? -50 : 50),
      };
      
      setFadeAnims([...fadeAnims, newAnim]);
      
      // Animate in the new item
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(newAnim.opacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(newAnim.translateX, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 100);
    }
  };

  const handleComplete = () => {
    // Section is already marked complete in the useEffect above
    setShowCompletionModal(false);
    navigation.goBack();
  };

  const handleContinueReading = () => {
    setShowCompletionModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: section.color }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.titleSection, { backgroundColor: section.color }]}>
        <Text style={styles.emoji}>{section.emoji}</Text>
        <Text style={styles.title}>{section.title}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reasons.slice(0, visibleCount).map((item, index) => {
          const animStyle = fadeAnims[index] ? {
            opacity: fadeAnims[index].opacity,
            transform: [{ translateX: fadeAnims[index].translateX }],
          } : {
            opacity: 1,
            transform: [{ translateX: 0 }],
          };
          
          const isChecked = checkedItems.includes(index);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => !isChecked && handleCheck(index)}
              activeOpacity={isChecked ? 1 : 0.7}
              disabled={isChecked}
            >
              <Animated.View
                style={[styles.reasonCard, animStyle, isChecked && styles.checkedCard]}
              >
                <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
                  {isChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.reasonText, isChecked && styles.checkedText]}>
                    {item.reason}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {item.description}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={showCompletionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: section.color }]}>
            <Text style={styles.modalEmoji}>{section.emoji}</Text>
            <Text style={styles.modalTitle}>Section Complete!</Text>
            <Text style={styles.modalMessage}>
              You've discovered all the reasons about {section.title.toLowerCase()} 💖
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleComplete}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Back to Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={handleContinueReading}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonTextSecondary}>Keep Reading</Text>
              </TouchableOpacity>
            </View>
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
    ...(Platform.OS === 'web' && {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }),
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    ...(Platform.OS === 'web' && {
      flexShrink: 0,
    }),
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      flexGrow: 1,
      flexShrink: 1,
      overflowY: 'scroll',
      WebkitOverflowScrolling: 'touch',
    }),
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  reasonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  checkedCard: {
    opacity: 0.6,
    backgroundColor: '#f8f8f8',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  checkedBox: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  reasonText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
    fontWeight: '500',
    marginBottom: 6,
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  modalButtons: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});
