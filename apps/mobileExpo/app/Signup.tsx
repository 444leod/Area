import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Dimensions } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const theme = useTheme();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);
        router.push("/(auth)/");
      } else {
        throw new Error(
          data.message || "Une erreur est survenue lors de l'inscription",
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors de l'inscription",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.background}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Rejoignez-nous et commencez à créer vos AREAs
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(1000).springify()}
          style={styles.formContainer}
        >
          <TextInput
            label="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Nom"
            value={lastName}
            onChangeText={setLastName}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry
            theme={{ colors: { primary: theme.colors.primary } }}
          />

          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            S'inscrire
          </Button>

          <Button
            mode="text"
            onPress={() => router.push("/")}
            style={styles.linkButton}
            labelStyle={styles.linkButtonText}
          >
            Déjà un compte ? Se connecter
          </Button>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    width: width * 0.9,
    alignSelf: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: "#192f6a",
  },
  linkButton: {
    marginTop: 15,
  },
  linkButtonText: {
    color: "white",
  },
});

export default SignUpScreen;
