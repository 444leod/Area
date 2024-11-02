import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AreaItem } from "@/components/AreaItem";

const mockItem = {
  _id: "1",
  active: true,
  action: {
    informations: {
      type: "email",
    },
  },
  reaction: {
    informations: {
      type: "calendar",
    },
  },
};

const mockToggleAreaStatus = jest.fn();
const mockGetIconName = jest.fn(() => "email");

describe("AreaItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(
      <AreaItem
        item={mockItem}
        toggleAreaStatus={mockToggleAreaStatus}
        getIconName={mockGetIconName}
      />,
    );

    expect(getByText("email → calendar")).toBeTruthy();
    expect(getByText("Actif")).toBeTruthy();
  });

  it("displays correct status for active item", () => {
    const { getByText } = render(
      <AreaItem
        item={mockItem}
        toggleAreaStatus={mockToggleAreaStatus}
        getIconName={mockGetIconName}
      />,
    );

    expect(getByText("Désactiver")).toBeTruthy();
  });

  it("displays correct status for inactive item", () => {
    const inactiveItem = { ...mockItem, active: false };
    const { getByText } = render(
      <AreaItem
        item={inactiveItem}
        toggleAreaStatus={mockToggleAreaStatus}
        getIconName={mockGetIconName}
      />,
    );

    expect(getByText("Inactif")).toBeTruthy();
    expect(getByText("Activer")).toBeTruthy();
  });

  it("calls toggleAreaStatus when toggle button is pressed", () => {
    const { getByText } = render(
      <AreaItem
        item={mockItem}
        toggleAreaStatus={mockToggleAreaStatus}
        getIconName={mockGetIconName}
      />,
    );

    fireEvent.press(getByText("Désactiver"));
    expect(mockToggleAreaStatus).toHaveBeenCalledWith("1");
  });
});
