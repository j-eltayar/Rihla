import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Landing({ route }) {
  const { userInfo } = route.params;

  React.useEffect(() => {
    console.log('User Info:', userInfo);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/ios-splash.png')} 
            style={styles.logo} 
            resizeMode="contain" 
          />
        </View>
        
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>Hello, {userInfo.name}! 👋</Text>
          <Text style={styles.emailText}>{userInfo.email}</Text>
          {userInfo.picture && (
            <Image 
              source={{ uri: userInfo.picture }} 
              style={styles.profilePicture}
            />
          )}
        </View>
      </View>
      
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
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 400,
    height: 400,
  },
  userInfoContainer: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A2C0B0',
    marginBottom: 10,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
});
