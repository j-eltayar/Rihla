import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';

const faults = [
  {
    id: 1,
    emoji: "🛏️",
    fault: "You steal all the blankets",
    why: "You can have them. Because you look so peaceful and cozy wrapped up like a burrito",
    position: { top: '15%', left: '20%' },
  },
  {
    id: 2,
    emoji: "⏰",
    fault: "You take forever to get ready",
    why: "Because the result is always worth the wait, you're always stunning",
    position: { top: '25%', left: '65%' },
  },
  {
    id: 3,
    emoji: "💪",
    fault: "You're stubborn",
    why: "Because your determination and passion for what you believe in is inspiring",
    position: { top: '40%', left: '15%' },
  },
  {
    id: 4,
    emoji: "🚗",
    fault: "You leave stuff in my car",
    why: "But then I get to keep a little piece of you with me to be reminded of you",
    position: { top: '55%', left: '70%' },
  },
  {
    id: 5,
    emoji: "❄️",
    fault: "You're always cold",
    why: "Yes it's cold, yes I find it cute when you say it anyways, no I can't change the weather but I would",
    position: { top: '35%', left: '45%' },
  },
  {
    id: 6,
    emoji: "🍽️",
    fault: "You can't choose what to eat",
    why: "Because you're open to trying new things and I like choosing for you",
    position: { top: '68%', left: '25%' },
  },
  {
    id: 7,
    emoji: "🎯",
    fault: "You're a perfectionist",
    why: "Because you push yourself to be the best version of you, and it's beautiful",
    position: { top: '20%', left: '45%' },
  },
  {
    id: 8,
    emoji: "🏆",
    fault: "You're too competitive",
    why: "Because watching you get fired up and passionate is amazing to see (didn't help you in billiards though)",
    position: { top: '50%', left: '50%' },
  },
  {
    id: 9,
    emoji: "🗺️",
    fault: "You're terrible with directions",
    why: "Because every wrong turn becomes an adventure with you",
    position: { top: '75%', left: '60%' },
  },
  {
    id: 10,
    emoji: "👗",
    fault: "You correct my french and my outfits",
    why: "Because your attention to detail helps me improve, and I appreciate your style",
    position: { top: '62%', left: '8%' },
  },
];

export default function YourFaultsScreen({ navigation }) {
  const [selectedFault, setSelectedFault] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleEmojiPress = (fault) => {
    setSelectedFault(fault);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedFault(null), 300);
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
        <Text style={styles.title}>Your "Faults" 🥰</Text>
        <Text style={styles.subtitle}>Tap an emoji to discover why I love it</Text>
      </View>

      <View style={styles.emojiContainer}>
        {faults.map((fault) => (
          <TouchableOpacity
            key={fault.id}
            style={[styles.emojiButton, fault.position]}
            onPress={() => handleEmojiPress(fault)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{fault.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedFault && (
              <>
                <Text style={styles.modalEmoji}>{selectedFault.emoji}</Text>
                <Text style={styles.modalFault}>{selectedFault.fault}</Text>
                <View style={styles.modalDivider} />
                <Text style={styles.modalLabel}>Why I love it:</Text>
                <Text style={styles.modalWhy}>{selectedFault.why}</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    color: '#FF6B6B',
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FF6B6B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emojiContainer: {
    flex: 1,
    position: 'relative',
  },
  emojiButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  emoji: {
    fontSize: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalFault: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 32,
  },
  modalDivider: {
    height: 2,
    backgroundColor: '#FFE5E9',
    marginBottom: 20,
    borderRadius: 1,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  modalWhy: {
    fontSize: 18,
    color: '#4B5563',
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  closeButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
