import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useMusic } from '../contexts/MusicContext';

export default function LandingScreen({ navigation }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const { isPlaying, togglePlayPause, skipToNext } = useMusic();

  const handleJamesPress = () => {
    setShowPasswordModal(true);
    setPassword('');
  };

  const handlePasswordSubmit = () => {
    if (password === 'hellojames1') {
      setShowPasswordModal(false);
      setPassword('');
      navigation.navigate('JamesMenu');
    } else {
      Alert.alert('Incorrect Password', 'Please try again.');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Choose your section</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.card, styles.raniaCard]}
          onPress={() => navigation.navigate('RaniaMenu')}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>💖</Text>
          <Text style={styles.cardTitle}>For Rania</Text>
          <Text style={styles.cardSubtitle}>A collection just for you</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.jamesCard]}
          onPress={handleJamesPress}
          activeOpacity={0.8}
        >
          <Text style={styles.cardEmoji}>🔒</Text>
          <Text style={styles.cardTitle}>For James</Text>
          <Text style={styles.cardSubtitle}>Password required</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.musicControls}>
        <Text style={styles.musicControlsTitle}>Music Controls 🎵</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={togglePlayPause}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>
              {isPlaying ? '⏸ Pause' : '▶️ Play'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <Text style={styles.controlButtonText}>⏭ Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.musicNote}>
        <Text style={styles.musicNoteEmoji}>🎵</Text>
        <Text style={styles.musicNoteText}>
          P.S. Turn up the volume and guess where this song is from 😉
        </Text>
      </View>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <Text style={styles.modalSubtitle}>For James section</Text>
            
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handlePasswordSubmit}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
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
  },
  header: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8a8a8a',
    fontWeight: '400',
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  raniaCard: {
    backgroundColor: '#F5E6E8',
    borderWidth: 2,
    borderColor: '#E8D5D8',
  },
  jamesCard: {
    backgroundColor: '#E3E8ED',
    borderWidth: 2,
    borderColor: '#D5DBE3',
  },
  cardEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
  },
  musicControls: {
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#F3E5F5',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E1BEE7',
    shadowColor: '#9C27B0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  musicControlsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6A1B9A',
    marginBottom: 12,
    textAlign: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  musicNote: {
    marginHorizontal: 24,
    marginBottom: 40,
    backgroundColor: '#E8F4F8',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#B3E5FC',
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  musicNoteEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  musicNoteText: {
    flex: 1,
    fontSize: 14,
    color: '#0277BD',
    fontWeight: '600',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  passwordInput: {
    borderWidth: 2,
    borderColor: '#E3E8ED',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    backgroundColor: '#FAFAFA',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#E3E8ED',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
