import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_CHECKLIST_KEY = '@daily_checklist';

export default function CFAPrepScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [examPassed, setExamPassed] = useState(false);
  const [examComplete, setExamComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Get 8 hours of sleep 😴', completed: false, emoji: '😴' },
    { id: 2, text: 'Drink 3 glasses of water 💧', completed: false, emoji: '💧' },
    { id: 3, text: 'Eat healthy meals 🥗', completed: false, emoji: '🥗' },
    { id: 4, text: 'Take time to relax 🧘‍♀️', completed: false, emoji: '🧘‍♀️' },
    { id: 5, text: 'Go outside for fresh air 🌳', completed: false, emoji: '🌳' },
    { id: 6, text: 'Study CFA material 📖', completed: false, emoji: '📖' },
    { id: 7, text: 'Exercise or stretch 🏃‍♀️', completed: false, emoji: '🏃‍♀️' },
  ]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const testDate = new Date('2026-02-02T09:00:00'); // Feb 2, 2026 at 9:00 AM
      const testEndDate = new Date('2026-02-03T00:00:00'); // Feb 3, 2026 at midnight
      const now = new Date();
      const difference = testDate - now;

      if (difference > 0) {
        // Before exam day
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setExamPassed(false);
        setExamComplete(false);
      } else if (now >= testDate && now < testEndDate) {
        // Exam day (Feb 2)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setExamPassed(true);
        setExamComplete(false);
      } else {
        // After exam day (Feb 3 onwards)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setExamPassed(true);
        setExamComplete(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadChecklist();
    checkAndResetDaily();
  }, []);

  const loadChecklist = async () => {
    try {
      const saved = await AsyncStorage.getItem(DAILY_CHECKLIST_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setChecklist(data.items);
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
    }
  };

  const checkAndResetDaily = async () => {
    try {
      const lastReset = await AsyncStorage.getItem('@last_checklist_reset');
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        // Reset all items to unchecked
        const resetItems = checklist.map(item => ({ ...item, completed: false }));
        setChecklist(resetItems);
        await AsyncStorage.setItem(DAILY_CHECKLIST_KEY, JSON.stringify({ items: resetItems }));
        await AsyncStorage.setItem('@last_checklist_reset', today);
      }
    } catch (error) {
      console.error('Error checking reset:', error);
    }
  };

  const toggleItem = async (id) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    
    try {
      await AsyncStorage.setItem(DAILY_CHECKLIST_KEY, JSON.stringify({ items: updated }));
      
      // Check if all items are now completed
      const allCompleted = updated.every(item => item.completed);
      if (allCompleted) {
        setShowCelebration(true);
      }
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  };

  const handleCelebrationClose = async () => {
    setShowCelebration(false);
    
    // Clear all checkboxes
    const resetItems = checklist.map(item => ({ ...item, completed: false }));
    setChecklist(resetItems);
    
    try {
      await AsyncStorage.setItem(DAILY_CHECKLIST_KEY, JSON.stringify({ items: resetItems }));
    } catch (error) {
      console.error('Error resetting checklist:', error);
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CFA Prep 📚</Text>
        <Text style={styles.subtitle}>Level I - February 2026</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {examComplete ? (
          <View style={styles.examDayCard}>
            <Image
              source={require('../assets/carousel/IMG_7234.jpg')}
              style={styles.examDayImage}
              resizeMode="cover"
            />
            <Text style={styles.examDayEmoji}>🎉</Text>
            <Text style={styles.examDayTitle}>You Did It!</Text>
            <Text style={styles.examDayMessage}>
              Congratulations on completing your CFA Level I exam!{'\n\n'}
              You showed up, you gave it your all, and you made it through.{'\n\n'}
              No matter the outcome, I'm incredibly proud of your dedication and hard work.{'\n\n'}
              <Text style={styles.examDayBold}>You're amazing! 🌟</Text>
            </Text>
            <View style={styles.examDayFooter}>
              <Text style={styles.examDayFooterText}>
                Time to celebrate! You earned it! 🎊❤️
              </Text>
            </View>
          </View>
        ) : examPassed ? (
          <View style={styles.examDayCard}>
            <Image
              source={require('../assets/carousel/IMG_7234.jpg')}
              style={styles.examDayImage}
              resizeMode="cover"
            />
            <Text style={styles.examDayEmoji}>🎯</Text>
            <Text style={styles.examDayTitle}>The Day Has Arrived!</Text>
            <Text style={styles.examDayMessage}>
              Today is your CFA Level I exam.{'\n\n'}
              You've prepared so well for this moment.{'\n\n'}
              Take a deep breath, trust yourself, and show them what you know.{'\n\n'}
              <Text style={styles.examDayBold}>You've got this! 💪</Text>
            </Text>
            <View style={styles.examDayFooter}>
              <Text style={styles.examDayFooterText}>
                I'm so proud of you! ❤️
              </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.timerCard}>
              <Text style={styles.timerTitle}>Time Until Exam</Text>
              <Text style={styles.testDate}>February 2, 2026</Text>
              
              <View style={styles.countdownContainer}>
            <View style={styles.timeBlock}>
              <Text style={styles.timeNumber}>{timeLeft.days}</Text>
              <Text style={styles.timeLabel}>Days</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeBlock}>
              <Text style={styles.timeNumber}>{String(timeLeft.hours).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>Hours</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeBlock}>
              <Text style={styles.timeNumber}>{String(timeLeft.minutes).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>Minutes</Text>
            </View>
            
            <Text style={styles.timeSeparator}>:</Text>
            
            <View style={styles.timeBlock}>
              <Text style={styles.timeNumber}>{String(timeLeft.seconds).padStart(2, '0')}</Text>
              <Text style={styles.timeLabel}>Seconds</Text>
            </View>
          </View>

          <Text style={styles.motivationText}>You've got this! 💪</Text>
        </View>

        <View style={styles.checklistCard}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Daily Self-Care ✨</Text>
            <Text style={styles.checklistProgress}>
              {completedCount} of {totalCount} completed
            </Text>
          </View>

          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checklistItem}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                item.completed && styles.checkboxChecked
              ]}>
                {item.completed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={[
                styles.checklistText,
                item.completed && styles.checklistTextCompleted
              ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
          </>
        )}
      </ScrollView>

      <Modal
        visible={showCelebration}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCelebrationClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/carousel/IMG_7234.jpg')}
              style={styles.celebrationImage}
              resizeMode="cover"
            />
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Amazing Job!</Text>
            <Text style={styles.modalMessage}>
              You completed all your self-care tasks today!{'\n\n'}
              Keep taking care of yourself while you study. You're doing great! 💪
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCelebrationClose}
            >
              <Text style={styles.modalButtonText}>Continue</Text>
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
    paddingBottom: 24,
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
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web' && {
      flexGrow: 1,
      flexShrink: 1,
      overflowY: 'scroll',
    }),
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F0E3',
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  testDate: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  timeNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#8a8a8a',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ccc',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  motivationText: {
    fontSize: 16,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '600',
  },
  checklistCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5E6E8',
  },
  checklistHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checklistTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  checklistProgress: {
    fontSize: 14,
    color: '#8a8a8a',
    fontWeight: '500',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  checklistText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 22,
  },
  checklistTextCompleted: {
    color: '#8a8a8a',
    textDecorationLine: 'line-through',
  },
  placeholderContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
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
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  celebrationImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#4A90E2',
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
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  examDayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  examDayImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 24,
    borderWidth: 5,
    borderColor: '#4A90E2',
  },
  examDayEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  examDayTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  examDayMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  examDayBold: {
    fontWeight: '700',
    color: '#4A90E2',
    fontSize: 20,
  },
  examDayFooter: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  examDayFooterText: {
    fontSize: 18,
    color: '#E91E63',
    textAlign: 'center',
    fontWeight: '600',
  },
});
