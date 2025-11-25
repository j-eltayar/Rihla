import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Profile({ route }) {
  const { userInfo } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {userInfo ? (
        <View style={styles.profileContainer}>
          {userInfo.picture && (
            <Image 
              source={{ uri: userInfo.picture }} 
              style={styles.profilePicture}
            />
          )}
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
        </View>
      ) : (
        <Text style={styles.subtitle}>No user info available</Text>
      )}
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffff0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A2C0B0',
    marginBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
