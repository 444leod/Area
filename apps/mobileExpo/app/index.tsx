import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      console.log(await response.json())
      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem("userToken", data.token);
        router.push('/(app)/');
      } else {
        throw new Error("Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      Alert.alert(
        "Erreur",
        "Impossible de se connecter. Veuillez vérifier vos identifiants.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.background}
      />
      <Animated.View
        entering={FadeInUp.duration(1000).springify()}
        style={styles.titleContainer}
      >
        <Text style={styles.title}>Bienvenue</Text>
        <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
        style={styles.formContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    width: width * 0.9,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    fontSize: 16,
    padding: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#192f6a",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
