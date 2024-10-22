import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "825177499555-dhg7f5e5lfcmj8jk006npd2aupm99jre.apps.googleusercontent.com",
    redirectUri: "com.jbazan.mobileexpo:/oauth2redirect",

  });

  const handleGoogleAuth = async (idToken: string, refreshToken: string, expireIn:string) => {
    try {
      const expirationDate = new Date(Date.now() + parseInt(expireIn) * 1000).toISOString();
      const response = await fetch(`${API_URL}/auth/google/mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ token: idToken, refreshToken, isMobile: true, expired_at: expirationDate })
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Error response body:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('No token received from server');
      }

      await AsyncStorage.setItem("userToken", data.token);
      setLoading(false);
      router.replace("/(auth)/");
    } catch (error) {
      console.error('Detailed error during Google authentication:', error);
      setLoading(false);
      Alert.alert(
          "Authentication Error",
          `Failed to authenticate: ${error.message}. Please try again later.`
      );
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      const { id_token } = response.params;
      const refresh_token = response.authentication?.refreshToken;

      const expiresIn  = response.authentication?.expiresIn;
        handleGoogleAuth(id_token, refresh_token, expiresIn);
    } else if (response?.type === "error") {
      console.error("Google Sign-In error:", response.error);
      Alert.alert(
          "Sign-In Error",
          "An error occurred during Google Sign-In. Please try again."
      );
    }
  }, [response]);

  useEffect(() => {
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        router.replace("/(auth)/");
      }
    } catch (error) {
      console.error("Error checking token:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
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
      const data = await response.json();
      if (response.ok) {
        await AsyncStorage.setItem("userToken", data.token);
        router.replace("/(auth)/");
      } else {
        throw new Error("Login error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert(
          "Error",
          "Unable to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleSignup = () => {
    router.push("/Signup");
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Connect to your account</Text>
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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
          />
          <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={loading}
          >
            <Text style={styles.buttonText}>Login with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
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
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupButton: {
    backgroundColor: "transparent",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "white",
    padding: 15,
    alignItems: "center",
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});