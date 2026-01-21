import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@james_notes';

export default function NotesScreen({ navigation }) {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (savedNotes !== null) {
        setNotes(savedNotes);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async () => {
    try {
      setIsSaving(true);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, notes);
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Error saving notes:', error);
      setIsSaving(false);
    }
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
        <View style={styles.headerContent}>
          <Text style={styles.title}>Notes 📝</Text>
          <Text style={styles.subtitle}>Your personal notes</Text>
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveNotes}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saved!' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.notesInput}
          placeholder="Start typing your notes here..."
          placeholderTextColor="#999"
          multiline={true}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  headerContent: {
    flex: 1,
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
  saveButton: {
    backgroundColor: '#E3E8ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    lineHeight: 24,
    color: '#1a1a1a',
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#E3E8ED',
  },
});
