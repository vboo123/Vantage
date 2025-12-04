import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import awsConfig from './src/config/aws-exports';
import AuthNavigator from './src/navigation/AuthNavigator';

// Configure Amplify
Amplify.configure(awsConfig);

const MainApp = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Vantage!</Text>
      <Text style={styles.subtext}>You are logged in.</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  // Listen for auth events (hub) - simplified for now by just checking user on mount
  // In a real app, use Hub.listen('auth', ...) to detect sign-in/sign-out dynamically

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainApp /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
});
