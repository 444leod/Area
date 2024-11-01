import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewAreaScreen from "@/app/(auth)/newArea/index";

// Mock data
const mockServices = [
  {
    _id: "1",
    name: "Email Service",
    actions: [
      {
        action_type: "email_trigger",
        name: "New Email",
        type: "email",
        params: [{ name: "subject", type: "string", required: true }],
        variables: ["sender", "subject"],
      },
    ],
    reactions: [
      {
        action_type: "send_email",
        name: "Send Email",
        type: "email",
        params: [
          { name: "recipient", type: "string", required: true },
          { name: "subject", type: "string", required: true },
        ],
      },
    ],
  },
];

// Mocks
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("fake-token")),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
}));

global.fetch = jest.fn();

describe("NewAreaScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockServices),
      }),
    );
  });

  it("fetches services on mount", async () => {
    render(<NewAreaScreen />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/services"),
        expect.any(Object),
      );
    });
  });

  it("handles service fetch error", async () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error")),
    );

    render(<NewAreaScreen />);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error",
        "Failed to fetch services",
      );
    });
  });
});
