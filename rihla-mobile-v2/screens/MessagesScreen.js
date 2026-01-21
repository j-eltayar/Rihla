import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const MESSAGES = [
  'Remember I\'m always here for you',
  'Remember I love you more than words can say',
  'Remember you make every day brighter',
  'Remember you\'re my favorite person',
  'Remember I\'m so proud of you',
];

export default function MessagesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Messages From Me 💌</Text>
        <Text style={styles.subtitle}>Just for you</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>💖</Text>
          <Text style={styles.introText}>
            These are little reminders from me to you.{'\n'}
            Read them whenever you need a smile.
          </Text>
        </View>

        {MESSAGES.map((message, index) => (
          <View key={index} style={styles.messageCard}>
            <View style={styles.messageContent}>
              <Text style={styles.messageBullet}>♡</Text>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footerCard}>
          <Text style={styles.footerText}>Always yours,{'\n'}James 💕</Text>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  introCard: {
    backgroundColor: '#F5E6E8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5D8',
  },
  introEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F5E6E8',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageBullet: {
    fontSize: 24,
    color: '#E8D5D8',
    marginRight: 12,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 16,
    color: '#1a1a1a',
    flex: 1,
    lineHeight: 24,
    fontWeight: '500',
  },
  footerCard: {
    backgroundColor: '#F5E6E8',
    borderRadius: 16,
    padding: 24,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5D8',
  },
  footerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
