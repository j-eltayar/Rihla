import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';

const comfortMessages = [
  {
    id: 1,
    title: "You're Stronger Than You Think",
    message: "Every challenge you've faced, you've overcome. This is just another moment that will pass, and you'll come out even stronger on the other side.",
    color: '#FFE5E9',
  },
  {
    id: 2,
    title: "I'm Here For You",
    message: "Always. No matter what you're going through, you don't have to face it alone. I'm right here, and I'm not going anywhere.",
    color: '#E3F0FF',
  },
  {
    id: 3,
    title: "It's Okay to Not Be Okay",
    message: "You don't have to be perfect. You don't have to have it all together. It's okay to feel what you're feeling. Take your time.",
    color: '#FFF0E6',
  },
  {
    id: 4,
    title: "Tomorrow is a New Day",
    message: "Today might be tough, but tomorrow brings new possibilities. Rest tonight, and know that things will look different in the morning.",
    color: '#E8F0E3',
  },
  {
    id: 5,
    title: "You Are Loved",
    message: "More than words can express. On your hardest days and your best days, you are deeply, completely, unconditionally loved.",
    color: '#F5E6F0',
  },
  {
    id: 6,
    title: "This Too Shall Pass",
    message: "Nothing lasts forever - not the good times, and not the hard times either. This difficult moment is temporary, and better days are coming.",
    color: '#E6F0F5',
  },
];

const quickComforts = [
  { id: 1, text: "Take a deep breath", emoji: "🌬️" },
  { id: 2, text: "You've got this", emoji: "💪" },
  { id: 3, text: "One step at a time", emoji: "👣" },
  { id: 4, text: "Be kind to yourself", emoji: "💝" },
  { id: 5, text: "Rest when you need to", emoji: "😌" },
  { id: 6, text: "You're doing great", emoji: "⭐" },
];

export default function HardDayScreen({ navigation }) {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleEmergencyCall = () => {
    const phoneNumber = '5149522696';
    const phoneURL = `tel:${phoneNumber}`;
    
    Linking.canOpenURL(phoneURL)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneURL);
        } else {
          Alert.alert(
            'Unable to make call',
            'Your device does not support phone calls.',
            [{ text: 'OK' }]
          );
        }
      })
      .catch((err) => {
        console.error('An error occurred', err);
        Alert.alert(
          'Error',
          'Unable to initiate the call. Please try again.',
          [{ text: 'OK' }]
        );
      });
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
        <Text style={styles.title}>For a Hard Day 🤗</Text>
        <Text style={styles.subtitle}>You're not alone in this</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>🌟</Text>
          <Text style={styles.heroText}>
            Hey hayete, I know today has been tough. But I want you to know that I see you, I believe in you, and I'm so proud of you for getting through this moment.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.emergencyButton}
          activeOpacity={0.8}
          onPress={handleEmergencyCall}
        >
          <Text style={styles.emergencyEmoji}>🚨</Text>
          <Text style={styles.emergencyText}>Emergency Support</Text>
          <Text style={styles.emergencySubtext}>Need immediate help? Tap here</Text>
          <Text style={styles.emergencyPs}>P.S. This is a 24/7 hotline</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reminders</Text>
          <View style={styles.quickGrid}>
            {quickComforts.map((item) => (
              <View key={item.id} style={styles.quickCard}>
                <Text style={styles.quickEmoji}>{item.emoji}</Text>
                <Text style={styles.quickText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Words of Comfort</Text>
          {comfortMessages.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.messageCard, { backgroundColor: item.color }]}
              onPress={() => setSelectedMessage(selectedMessage === item.id ? null : item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.messageTitle}>{item.title}</Text>
                <Text style={styles.expandIcon}>
                  {selectedMessage === item.id ? '−' : '+'}
                </Text>
              </View>
              {selectedMessage === item.id && (
                <Text style={styles.messageText}>{item.message}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerEmoji}>💕</Text>
          <Text style={styles.footerText}>
            Remember: You're amazing, you're capable, and you're loved. This hard moment doesn't define you - your strength and resilience do.
          </Text>
          <Text style={styles.footerSignature}>Always here for you, JE</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#E3F0FF',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroText: {
    fontSize: 18,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  emergencyButton: {
    backgroundColor: '#FF4444',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FF6666',
  },
  emergencyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emergencyText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  emergencySubtext: {
    fontSize: 14,
    color: '#FFE5E5',
    fontWeight: '600',
  },
  emergencyPs: {
    fontSize: 12,
    color: '#FFCCCC',
    fontWeight: '500',
    fontStyle: 'italic',
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  quickEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '600',
  },
  messageCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    flex: 1,
    letterSpacing: -0.3,
  },
  expandIcon: {
    fontSize: 32,
    color: '#4A90E2',
    fontWeight: '300',
    marginLeft: 12,
  },
  messageText: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 26,
    marginTop: 16,
    fontStyle: 'italic',
  },
  footerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFE5E9',
  },
  footerEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 17,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 27,
    marginBottom: 16,
    fontWeight: '500',
  },
  footerSignature: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
