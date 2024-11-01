import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import { AreaDetailsModal } from "@/components/AreaDetailsModal";

const mockArea = {
  _id: "1",
  action: {
    informations: {
      type: "email",
      subject: "Test Subject",
    },
  },
  reaction: {
    informations: {
      type: "calendar",
      event: "Test Event",
    },
  },
};

describe("AreaDetailsModal", () => {
  const mockHideModal = jest.fn();
  const mockDeleteArea = jest.fn();
  const mockToggleAreaStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
  });

  it("renders area details when area is provided", () => {
    const { getByText } = render(
      <AreaDetailsModal
        visible={true}
        hideModal={mockHideModal}
        area={mockArea}
        toggleAreaStatus={mockToggleAreaStatus}
        deleteArea={mockDeleteArea}
      />,
    );

    expect(getByText("Area Details")).toBeTruthy();
    expect(getByText("Action")).toBeTruthy();
    expect(getByText("Reaction")).toBeTruthy();
  });

  it("shows confirmation dialog when deleting", () => {
    const { getByText } = render(
      <AreaDetailsModal
        visible={true}
        hideModal={mockHideModal}
        area={mockArea}
        toggleAreaStatus={mockToggleAreaStatus}
        deleteArea={mockDeleteArea}
      />,
    );

    fireEvent.press(getByText("Delete Area"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Delete Area",
      "Are you sure you want to delete this area?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel" }),
        expect.objectContaining({ text: "OK" }),
      ]),
    );
  });

  it("calls hideModal when close button is pressed", () => {
    const { getByText } = render(
      <AreaDetailsModal
        visible={true}
        hideModal={mockHideModal}
        area={mockArea}
        toggleAreaStatus={mockToggleAreaStatus}
        deleteArea={mockDeleteArea}
      />,
    );

    fireEvent.press(getByText("Close"));
    expect(mockHideModal).toHaveBeenCalled();
  });

  it("calls deleteArea and hideModal when confirming deletion", () => {
    const { getByText } = render(
      <AreaDetailsModal
        visible={true}
        hideModal={mockHideModal}
        area={mockArea}
        toggleAreaStatus={mockToggleAreaStatus}
        deleteArea={mockDeleteArea}
      />,
    );

    fireEvent.press(getByText("Delete Area"));
    // Simulate pressing OK on the alert
    Alert.alert.mock.calls[0][2][1].onPress();

    expect(mockDeleteArea).toHaveBeenCalledWith("1");
    expect(mockHideModal).toHaveBeenCalled();
  });
});
