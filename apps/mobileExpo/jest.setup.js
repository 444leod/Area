import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    FadeInDown: { duration: () => ({ springify: () => ({}) }) },
    FadeInUp: { duration: () => ({ springify: () => ({}) }) },
  };
});

jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock pour expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("react-native-paper", () => {
  const actual = jest.requireActual("react-native-paper");
  return {
    ...actual,
    Portal: ({ children }) => children,
    Modal: ({ children, visible }) => (visible ? children : null),
    useTheme: () => ({
      colors: {
        primary: "#000000",
        error: "#FF0000",
      },
    }),
  };
});

jest.mock("@expo/vector-icons", () => ({
  MaterialCommunityIcons: "MaterialCommunityIcons",
}));

// Ajoutez ceci pour éviter les avertissements de la console
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
