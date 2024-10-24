import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const postNewArea = async (actionDetails, reactionDetails) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "Not authorized");
      return { error: true, message: "Not authorized" };
    }

    const newArea = {
      action: actionDetails,
      reaction: reactionDetails,
    };

    const response = await fetch(`${API_URL}/areas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newArea),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response:", errorData);
      return {
        error: true,
        message: `Failed to create new area: ${errorData}`,
      };
    }

    const createdArea = await response.json();
    return { success: true, area: createdArea };
  } catch (err) {
    console.error("Error creating new area:", err);
    return { error: true, message: "Failed to create automation" };
  }
};
