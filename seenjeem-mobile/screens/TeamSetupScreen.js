import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TeamSetupScreen({ navigation }) {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');

  const handleStart = () => {
    if (team1Name.trim() && team2Name.trim()) {
      navigation.navigate('Category', {
        team1Name: team1Name.trim(),
        team2Name: team2Name.trim(),
        team1Score: 0,
        team2Score: 0,
        team1Helpers: 3,
        team2Helpers: 3,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>Team Setup</Text>
        <Text style={styles.subtitle}>Enter team names to begin</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Team 1 Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Team 1 name"
              placeholderTextColor="#666"
              value={team1Name}
              onChangeText={setTeam1Name}
              maxLength={20}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Team 2 Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Team 2 name"
              placeholderTextColor="#666"
              value={team2Name}
              onChangeText={setTeam2Name}
              maxLength={20}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.startButton, (!team1Name.trim() || !team2Name.trim()) && styles.startButtonDisabled]}
            onPress={handleStart}
            disabled={!team1Name.trim() || !team2Name.trim()}
          >
            <Text style={styles.startButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    gap: 24,
    marginBottom: 40,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#2c3e50',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: '600',
  },
});
