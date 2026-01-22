import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScoreScreen({ navigation, route }) {
  const { team1Name, team2Name, team1Score, team2Score } = route.params;

  const winner = team1Score > team2Score ? team1Name : team2Score > team1Score ? team2Name : 'Tie';
  const isDraw = team1Score === team2Score;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Game Over!</Text>

        <View style={styles.winnerContainer}>
          {isDraw ? (
            <>
              <Text style={styles.winnerEmoji}>🤝</Text>
              <Text style={styles.winnerText}>It's a Draw!</Text>
            </>
          ) : (
            <>
              <Text style={styles.winnerEmoji}>🏆</Text>
              <Text style={styles.winnerText}>{winner} Wins!</Text>
            </>
          )}
        </View>

        <View style={styles.scoresContainer}>
          <View style={[
            styles.teamScoreCard,
            team1Score > team2Score && styles.winningTeam
          ]}>
            <Text style={styles.teamName}>{team1Name}</Text>
            <Text style={styles.finalScore}>{team1Score}</Text>
            <Text style={styles.pointsLabel}>points</Text>
          </View>

          <View style={[
            styles.teamScoreCard,
            team2Score > team1Score && styles.winningTeam
          ]}>
            <Text style={styles.teamName}>{team2Name}</Text>
            <Text style={styles.finalScore}>{team2Score}</Text>
            <Text style={styles.pointsLabel}>points</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.playAgainButtonText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.popToTop()}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginBottom: 30,
  },
  winnerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  winnerEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  winnerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  scoresContainer: {
    gap: 16,
    marginBottom: 40,
  },
  teamScoreCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winningTeam: {
    borderColor: '#f39c12',
    backgroundColor: '#fff9f0',
  },
  teamName: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  finalScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: '#95a5a6',
  },
  buttonContainer: {
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  homeButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: '600',
  },
});
