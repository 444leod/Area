import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

const Profile = () => {
  const theme = useTheme();
  const router = useRouter();
  const segments = useSegments();

  const handleLogout = async () => {
    try {
      // Nettoyage du cache (token de l'utilisateur)
      await AsyncStorage.removeItem('userToken');
      // Vous pouvez ajouter d'autres éléments à nettoyer ici si nécessaire

      // Redirection vers la page de connexion
      // On remonte jusqu'à la racine de l'application
      const rootSegment = segments[0] === '(auth)' ? '/' : '/';
      router.replace(rootSegment);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>Profil</Text>
      <Text style={styles.text}>Bienvenue sur votre profil!</Text>
      <Button 
        mode="contained" 
        onPress={handleLogout} 
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        Se déconnecter
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default Profile;