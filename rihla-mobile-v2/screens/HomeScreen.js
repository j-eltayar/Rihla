import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { useProgress } from '../contexts/ProgressContext';

export default function HomeScreen({ navigation }) {
  const { completedSections, sectionProgress, getTotalCompleted, getTotalReasons, resetProgress } = useProgress();
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [hasShownCelebration, setHasShownCelebration] = React.useState(false);
  const sections = [
    { id: 'smile', title: 'Your Smile', emoji: '😊', color: '#F5E6E8' },
    { id: 'personality', title: 'Your Personality', emoji: '✨', color: '#E8E3F0' },
    { id: 'kindness', title: 'Your Kindness', emoji: '💕', color: '#EDE5E3' },
    { id: 'intelligence', title: 'Your Intelligence', emoji: '🧠', color: '#E3E8ED' },
    { id: 'beauty', title: 'Your Beauty', emoji: '🌸', color: '#EBE3EB' },
    { id: 'heart', title: 'Your Heart', emoji: '❤️', color: '#E8D5D8' },
    { id: 'everything', title: 'Everything About You', emoji: '🌟', color: '#EDE8E3' },
  ];

  // Calculate total reasons across all sections  
  const totalReasons = 38; // One more than the actual count - the unexplainable reason

  // Check if all sections are completed
  const allSectionsComplete = sections.length === completedSections.length;

  // Show celebration when all sections are complete (only once)
  React.useEffect(() => {
    if (allSectionsComplete && !hasShownCelebration) {
      setTimeout(() => {
        setShowCelebration(true);
        setHasShownCelebration(true);
      }, 500);
    }
  }, [allSectionsComplete, hasShownCelebration]);

  const handleReset = () => {
    resetProgress();
    setHasShownCelebration(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>For Rania</Text>
        <Text style={styles.subtitle}>Why I love you</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(getTotalCompleted() / totalReasons) * 100}%` }
                ]}
              />
            </View>
            <View 
              style={[
                styles.turtleContainer,
                { left: `${Math.max(0, Math.min(95, (getTotalCompleted() / totalReasons) * 100))}%` }
              ]}
            >
              <Text style={styles.turtle}>🐢</Text>
            </View>
          </View>
          <Text style={styles.progressText}>
            {getTotalCompleted()} of {totalReasons} reasons discovered
          </Text>
          {getTotalCompleted() === 37 && (
            <Text style={styles.mysterySub}>
              One reason remains... ✨
            </Text>
          )}
        </View>
        {getTotalCompleted() > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section.id);
          const progress = sectionProgress[section.id];
          
          return (
            <TouchableOpacity
              key={section.id}
              style={[styles.card, { backgroundColor: section.color }]}
              onPress={() => navigation.navigate('Detail', { section })}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{section.emoji}</Text>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{section.title}</Text>
                {progress && (
                  <Text style={styles.cardProgress}>
                    {progress.checked}/{progress.total}
                  </Text>
                )}
              </View>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓</Text>
                </View>
              )}
              {!isCompleted && <Text style={styles.arrow}>→</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={showCelebration}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCelebration(false)}
      >
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContent}>
            <Text style={styles.celebrationEmojis}>🎉 💖 ✨</Text>
            <Text style={styles.celebrationTitle}>All Complete!</Text>
            <Text style={styles.celebrationMessage}>
              You've discovered 37 reasons why I love you
            </Text>
            <Text style={styles.celebrationSubtext}>
              But there's always one more reason that can't be put into words...
              As we've said there is always something unexplainable 💕
            </Text>
            <TouchableOpacity
              style={styles.celebrationButton}
              onPress={() => setShowCelebration(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.celebrationButtonText}>Forever Yours 💖</Text>
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
    ...(Platform.OS === 'web' && {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }),
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...(Platform.OS === 'web' && {
      flexShrink: 0,
    }),
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8a8a8a',
    fontWeight: '400',
  },
  progressContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressBarContainer: {
    position: 'relative',
    height: 36,
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#E8E3F0',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#9B8FA8',
    borderRadius: 6,
  },
  turtleContainer: {
    position: 'absolute',
    top: 0,
    marginLeft: -14,
  },
  turtle: {
    fontSize: 28,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  mysterySub: {
    fontSize: 12,
    color: '#9B8FA8',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  resetButtonText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
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
    paddingBottom: 40,
    ...(Platform.OS === 'web' && {
      minHeight: '100%',
    }),
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.03)',
  },
  emoji: {
    fontSize: 24,
    marginRight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cardProgress: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    fontWeight: '400',
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  arrow: {
    fontSize: 18,
    color: '#c0c0c0',
    fontWeight: '300',
  },
  celebrationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  celebrationContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  celebrationEmojis: {
    fontSize: 72,
    marginBottom: 24,
  },
  celebrationTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    textAlign: 'center',
  },
  celebrationMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 26,
    fontWeight: '500',
  },
  celebrationSubtext: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  celebrationButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  celebrationButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
