import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_STORAGE_KEY = '@james_reminders';

const DEFAULT_REMINDERS = [
  'Remember to cherish her',
  'Remember to make her happy',
  'Remember to respect her',
  'Remember to listen to her',
  'Remember to appreciate the little things',
];

export default function RemindersScreen({ navigation }) {
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS);
  const [newReminder, setNewReminder] = useState('');

  // Load reminders on mount
  useEffect(() => {
    loadReminders();
  }, []);

  // Save reminders whenever they change
  useEffect(() => {
    saveReminders();
  }, [reminders]);

  const loadReminders = async () => {
    try {
      const savedReminders = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
      if (savedReminders !== null) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const saveReminders = async () => {
    try {
      await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const addReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder.trim()]);
      setNewReminder('');
    }
  };

  const deleteReminder = (index) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newReminders = reminders.filter((_, i) => i !== index);
            setReminders(newReminders);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reminders ⏰</Text>
        <Text style={styles.subtitle}>Things to remember</Text>
      </View>

      <View style={styles.addReminderSection}>
        <TextInput
          style={styles.input}
          placeholder="Add a new reminder..."
          placeholderTextColor="#999"
          value={newReminder}
          onChangeText={setNewReminder}
          onSubmitEditing={addReminder}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addReminder}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>⏰</Text>
            <Text style={styles.emptyText}>No reminders yet</Text>
            <Text style={styles.emptySubtext}>Add one above to get started</Text>
          </View>
        ) : (
          reminders.map((reminder, index) => (
            <View key={index} style={styles.reminderCard}>
              <View style={styles.reminderContent}>
                <Text style={styles.reminderBullet}>•</Text>
                <Text style={styles.reminderText}>{reminder}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteReminder(index)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    fontSize: 13,
    color: '#8a8a8a',
    fontWeight: '400',
  },
  addReminderSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#E3E8ED',
  },
  addButton: {
    backgroundColor: '#E8E3F0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderBullet: {
    fontSize: 24,
    color: '#E8E3F0',
    marginRight: 12,
    fontWeight: '700',
  },
  reminderText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 22,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 24,
    color: '#FF6B6B',
    fontWeight: '400',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
  },
});
