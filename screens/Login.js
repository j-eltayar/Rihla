import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [userInfo, setUserInfo] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const redirectUri = makeRedirectUri({
    scheme: 'com.anonymous.Rihla',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: '816888747746-r3dsfs4fk63kqe72t5ppico00etmrp2e.apps.googleusercontent.com',
    androidClientId: '816888747746-e2uqjvq8b0d1popr4t1su4dombllrc6g.apps.googleusercontent.com',
  });

  // Check for saved user info on mount
  React.useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userInfo');
      if (storedUserInfo) {
        const user = JSON.parse(storedUserInfo);
        setUserInfo(user);
        navigation.replace('Main', { userInfo: user });
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then((res) => res.json())
        .then(async (user) => {
          setUserInfo(user);
          // Save user info to AsyncStorage
          await AsyncStorage.setItem('userInfo', JSON.stringify(user));
          navigation.replace('Main', { userInfo: user });
        });
    }
  }, [response]);

  const googleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#A2C0B0" />
      ) : (
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
            
            <TouchableOpacity 
              style={styles.googleButton}
              onPress={googleSignIn}
              disabled={!request}
            >
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    minWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
});
