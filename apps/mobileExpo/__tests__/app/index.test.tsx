import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "@/app";

// Mock des dépendances
jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    FadeInDown: { duration: () => ({ springify: () => ({}) }) },
    FadeInUp: { duration: () => ({ springify: () => ({}) }) },
  };
});

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: () => [null, null, jest.fn()],
}));

describe("LoginScreen", () => {
  // Supprime les logs d'erreur console pendant les tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText("Welcome")).toBeTruthy();
    expect(getByText("Connect to your account")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Login with Google")).toBeTruthy();
    expect(getByText("Sign Up")).toBeTruthy();
  });

  it("handles login with email and password", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "fake-token" }),
      }),
    );

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "password123");

    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "userToken",
        "fake-token",
      );
    });
  });

  it("handles login failure", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      }),
    );

    const alertSpy = jest.spyOn(Alert, "alert");

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");

    const loginButton = getByText("Login");
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "Unable to login. Please check your credentials.",
      );
    });
  });

  it("checks for existing token on mount", async () => {
    AsyncStorage.getItem.mockImplementationOnce(() =>
      Promise.resolve("existing-token"),
    );

    render(<LoginScreen />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("userToken");
    });
  });

  // Test pour la fonction handleGoogleLogin
  it("handles Google login button press", () => {
    const { getByText } = render(<LoginScreen />);
    const googleButton = getByText("Login with Google");
    fireEvent.press(googleButton);
    // Vérifie que le bouton est cliquable et ne cause pas d'erreur
    expect(googleButton).toBeTruthy();
  });
});
