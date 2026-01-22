import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTIONS } from '../data/questions';

export default function QuizScreen({ navigation, route }) {
  const { 
    team1Name, team2Name, team1Score, team2Score, 
    team1Helpers, team2Helpers, category, categoryName,
    questionIndex, pointValue
  } = route.params;

  const questions = QUESTIONS[category];
  const [currentTeam, setCurrentTeam] = useState(1); // 1 or 2
  const [scores, setScores] = useState({ team1: team1Score, team2: team2Score });
  const [helpers, setHelpers] = useState({ team1: team1Helpers, team2: team2Helpers });
  const [eliminatedOptions, setEliminatedOptions] = useState([]);

  const currentQuestion = questions[questionIndex];

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const newScores = {
        ...scores,
        [`team${currentTeam}`]: scores[`team${currentTeam}`] + pointValue,
      };
      setScores(newScores);
      
      Alert.alert(
        '✅ Correct!',
        `${currentTeam === 1 ? team1Name : team2Name} earned ${pointValue} points!`,
        [{ 
          text: 'Continue', 
          onPress: () => {
            navigation.navigate('Category', {
              team1Name,
              team2Name,
              team1Score: newScores.team1,
              team2Score: newScores.team2,
              team1Helpers: helpers.team1,
              team2Helpers: helpers.team2,
            });
          }
        }]
      );
    } else {
      Alert.alert(
        '❌ Wrong!',
        `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
        [{ 
          text: 'Continue', 
          onPress: () => {
            navigation.navigate('Category', {
              team1Name,
              team2Name,
              team1Score: scores.team1,
              team2Score: scores.team2,
              team1Helpers: helpers.team1,
              team2Helpers: helpers.team2,
            });
          }
        }]
      );
    }
  };

  const useHelper = () => {
    const currentHelperCount = helpers[`team${currentTeam}`];
    
    if (currentHelperCount <= 0) {
      Alert.alert('No Helpers Left', 'Your team has used all helper tools!');
      return;
    }

    // Eliminate 2 wrong answers
    const wrongOptions = currentQuestion.options
      .map((opt, idx) => idx)
      .filter(idx => idx !== currentQuestion.correctAnswer);
    
    const toEliminate = wrongOptions.slice(0, 2);
    setEliminatedOptions(toEliminate);
    
    setHelpers({
      ...helpers,
      [`team${currentTeam}`]: currentHelperCount - 1,
    });
    
    Alert.alert(
      '💡 Helper Used',
      'Two wrong answers have been eliminated!',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.questionInfo}>
          <Text style={styles.categoryText}>{categoryName}</Text>
          <Text style={styles.pointValue}>{pointValue} Points</Text>
        </View>

        <View style={styles.teamIndicator}>
          <Text style={styles.teamTurn}>
            {currentTeam === 1 ? team1Name : team2Name}'s Turn
          </Text>
          <Text style={styles.helperCount}>
            💡 Helpers: {helpers[`team${currentTeam}`]}
          </Text>
        </View>
      </View>

      <View style={styles.scoreBar}>
        <View style={styles.teamScoreBox}>
          <Text style={styles.teamScoreLabel}>{team1Name}</Text>
          <Text style={styles.teamScoreValue}>{scores.team1}</Text>
        </View>
        <View style={styles.teamScoreBox}>
          <Text style={styles.teamScoreLabel}>{team2Name}</Text>
          <Text style={styles.teamScoreValue}>{scores.team2}</Text>
        </View>
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              eliminatedOptions.includes(index) && styles.optionButtonEliminated,
            ]}
            onPress={() => handleAnswer(index)}
            disabled={eliminatedOptions.includes(index)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              eliminatedOptions.includes(index) && styles.optionTextEliminated,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.helperButton, helpers[`team${currentTeam}`] === 0 && styles.helperButtonDisabled]}
        onPress={useHelper}
        disabled={helpers[`team${currentTeam}`] === 0}
      >
        <Text style={styles.helperButtonText}>
          💡 Use Helper ({helpers[`team${currentTeam}`]} left)
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 12,
    paddingTop: 6,
    gap: 8,
  },
  questionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  pointValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
  },
  teamIndicator: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamTurn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  helperCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  scoreBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 10,
  },
  teamScoreBox: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  teamScoreLabel: {
    fontSize: 10,
    color: '#ecf0f1',
    marginBottom: 2,
  },
  teamScoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  questionContainer: {
    padding: 12,
    paddingVertical: 16,
    marginHorizontal: 12,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#dfe6e9',
    width: '48%',
    minHeight: 60,
    justifyContent: 'center',
  },
  optionButtonEliminated: {
    backgroundColor: '#ecf0f1',
    opacity: 0.4,
  },
  optionText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  optionTextEliminated: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  helperButton: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#e67e22',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  helperButtonDisabled: {
    backgroundColor: '#ecf0f1',
    opacity: 0.5,
  },
  helperButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
