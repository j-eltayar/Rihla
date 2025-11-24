import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function Login({ navigation }) {
  const GoogleLogin = async () => {
    // check if users' device has google play services
    await GoogleSignin.hasPlayServices();

    // initiates signIn process
    const userInfo = await GoogleSignin.signIn();
    return userInfo;
  };

  const googleSignIn = async () => {
    try {
      const response = await GoogleLogin();

      // retrieve user data
      const { idToken, user } = response.data ?? {};
      if (idToken) {
        console.log('User signed in:', user);
        // TODO: Server call to validate the token & process the user data for signing In
        // await processUserData(idToken, user);
        
        // Navigate to home or main screen after successful login
        // navigation.navigate('Home');
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

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
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Your journey begins here</Text>
          
          <GoogleSigninButton 
            style={styles.googleButton}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Light}
            onPress={googleSignIn}
          />
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
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A2C0B0',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  googleButton: {
    width: 250,
    height: 48,
  },
});
