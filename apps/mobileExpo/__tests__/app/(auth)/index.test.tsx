import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import DashboardScreen from "@/app/(auth)/index";

// Mock des données
const mockAreas = [
  {
    _id: "1",
    active: true,
    action: {
      informations: { type: "email" },
    },
    reaction: {
      informations: { type: "calendar" },
    },
  },
  {
    _id: "2",
    active: false,
    action: {
      informations: { type: "weather" },
    },
    reaction: {
      informations: { type: "email" },
    },
  },
];

// Setup des mocks
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("fake-token")),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: "MaterialCommunityIcons",
}));

// Mock de fetch global
global.fetch = jest.fn();

describe("DashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAreas),
      }),
    );
  });

  it("fetches and displays areas", async () => {
    const { findByText } = render(<DashboardScreen />);

    // Vérifie que les areas sont affichées
    await findByText("email → calendar");
    await findByText("weather → email");
  });

  it("shows empty state when no areas", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );

    const { findByText } = render(<DashboardScreen />);

    await findByText("Aucune AREA trouvée. Créez-en une nouvelle !");
  });

  it("handles fetch error", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    render(<DashboardScreen />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Erreur",
        "Impossible de récupérer vos AREAs",
      );
    });
  });

  it("can toggle area status", async () => {
    const { findByText } = render(<DashboardScreen />);

    const toggleButton = await findByText("Désactiver");
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/areas/1/toggle"),
        expect.objectContaining({
          method: "PATCH",
          headers: {
            Authorization: "Bearer fake-token",
          },
        }),
      );
    });
  });

  it("can delete area", async () => {
    const { findByText } = render(<DashboardScreen />);

    // Ouvre le modal
    const areaItem = await findByText("email → calendar");
    fireEvent.press(areaItem);

    // Click sur delete
    const deleteButton = await findByText("Delete Area");
    fireEvent.press(deleteButton);

    // Confirme la suppression
    const alertSpy = jest.spyOn(Alert, "alert");
    const [, , buttons] = alertSpy.mock.calls[0];
    const confirmButton = buttons?.find((button) => button.text === "OK");
    confirmButton?.onPress?.();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/areas/1"),
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: "Bearer fake-token",
          },
        }),
      );
    });
  });
});
