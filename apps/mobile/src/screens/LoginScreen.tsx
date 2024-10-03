import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph } from 'react-native-paper';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('userToken', data.token);
        navigation.navigate('Dashboard');
      } else {
        throw new Error('Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter. Veuillez vérifier vos identifiants.');
    }
  };


  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bienvenue</Title>
      <Paragraph style={styles.subtitle}>Connectez-vous pour continuer</Paragraph>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', padding: 10 }}>
        <Button onPress={() => navigation.navigate('Signup')} style={{ flex: 1, marginRight: 10 }}>
          Créer un compte
        </Button>
        <Button mode="contained" onPress={handleLogin} style={{ flex: 1 }}>
          Se connecter
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default LoginScreen;