import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Profile from "@/app/(auth)/profile/index";

// Mock data
const mockProfile = {
  _id: "1",
  first_name: "John",
  email: "john@example.com",
  areas: [
    {
      _id: "area1",
      active: true,
      action: {
        informations: { type: "email" },
      },
      reaction: {
        informations: { type: "calendar" },
      },
    },
    {
      _id: "area2",
      active: false,
      action: {
        informations: { type: "weather" },
      },
      reaction: {
        informations: { type: "notification" },
      },
    },
  ],
};

// Mocks
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
  useSegments: () => ["(auth)"],
}));

global.fetch = jest.fn();

describe("Profile Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue("fake-token");
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProfile),
      }),
    );
  });

  it("shows loading state initially", () => {
    const { getByText } = render(<Profile />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders profile information after loading", async () => {
    const { findByText } = render(<Profile />);

    await findByText("John");
    await findByText("john@example.com");
  });

  it("displays correct statistics", async () => {
    const { findByText } = render(<Profile />);

    await findByText("2"); // Total Areas
    await findByText("1"); // Active Areas
    await findByText("50%"); // Active Rate
  });

  it("displays all areas", async () => {
    const { findByText } = render(<Profile />);

    await findByText("email → calendar");
    await findByText("weather → notification");
    await findByText("Active");
    await findByText("Inactive");
  });

  it("handles logout correctly", async () => {
    const { findByText } = render(<Profile />);
    const logoutButton = await findByText("Log Out");

    fireEvent.press(logoutButton);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("userToken");
    });
  });

  it("handles profile fetch error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      }),
    );

    render(<Profile />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch profile");
    });
  });
});
