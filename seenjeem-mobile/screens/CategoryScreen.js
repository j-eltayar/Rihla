import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, QUESTIONS } from '../data/questions';

export default function CategoryScreen({ navigation, route }) {
  const { team1Name, team2Name, team1Score, team2Score, team1Helpers, team2Helpers } = route.params;

  const handleQuestionSelect = (category, questionIndex, pointValue) => {
    navigation.navigate('Quiz', {
      ...route.params,
      category: category.id,
      categoryName: category.name,
      questionIndex,
      pointValue,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Compact Score Header */}
      <View style={styles.scoreHeader}>
        <View style={styles.teamScoreBox}>
          <Text style={styles.teamName}>{team1Name}</Text>
          <Text style={styles.score}>{team1Score}</Text>
        </View>
        <Text style={styles.vs}>vs</Text>
        <View style={styles.teamScoreBox}>
          <Text style={styles.teamName}>{team2Name}</Text>
          <Text style={styles.score}>{team2Score}</Text>
        </View>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesWrapper}>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category, catIndex) => (
            <View key={category.id} style={styles.categoryContainer}>
              {/* Category Card */}
              <View style={[styles.categoryCard, { backgroundColor: category.color }]}>
                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>

              {/* Question Buttons Overlaying */}
              <View style={styles.questionButtonsRow}>
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.pointButton}
                    onPress={() => handleQuestionSelect(category, index, ((index % 3) + 1) * 200)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.pointText}>{((index % 3) + 1) * 200}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  teamScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamName: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  vs: {
    fontSize: 12,
    color: '#95a5a6',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  categoriesWrapper: {
    flex: 1,
    paddingHorizontal: 10,
  },
  categoriesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    gap: 8,
  },
  categoryContainer: {
    width: '32%',
    position: 'relative',
    marginBottom: 8,
  },
  categoryCard: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  questionButtonsRow: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: -20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  pointButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    minWidth: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pointText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  backButton: {
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dfe6e9',
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
});
