import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import SignUpScreen from "@/app/Signup";

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("validates empty fields", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByTestId } = render(<SignUpScreen />);

    const signUpButton = getByTestId("signup-submit-button");
    fireEvent.press(signUpButton);

    expect(alertSpy).toHaveBeenCalledWith(
      "Erreur",
      "Veuillez remplir tous les champs",
    );
  });

  it("validates email format", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId("signup-firstname-input"), "John");
    fireEvent.changeText(getByTestId("signup-lastname-input"), "Doe");
    fireEvent.changeText(getByTestId("signup-email-input"), "invalid-email");
    fireEvent.changeText(getByTestId("signup-password-input"), "password123");

    fireEvent.press(getByTestId("signup-submit-button"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Erreur",
      "Veuillez entrer une adresse email valide",
    );
  });

  it("handles successful registration", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: "fake-token" }),
      }),
    );

    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId("signup-firstname-input"), "John");
    fireEvent.changeText(getByTestId("signup-lastname-input"), "Doe");
    fireEvent.changeText(
      getByTestId("signup-email-input"),
      "john.doe@example.com",
    );
    fireEvent.changeText(getByTestId("signup-password-input"), "password123");

    fireEvent.press(getByTestId("signup-submit-button"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
            password: "password123",
          }),
        }),
      );
    });
  });

  it("handles registration failure", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            message: "L'email est déjà utilisé",
          }),
      }),
    );

    const { getByTestId } = render(<SignUpScreen />);

    fireEvent.changeText(getByTestId("signup-firstname-input"), "John");
    fireEvent.changeText(getByTestId("signup-lastname-input"), "Doe");
    fireEvent.changeText(
      getByTestId("signup-email-input"),
      "existing@example.com",
    );
    fireEvent.changeText(getByTestId("signup-password-input"), "password123");

    fireEvent.press(getByTestId("signup-submit-button"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Erreur",
        "L'email est déjà utilisé",
      );
    });
  });
});
