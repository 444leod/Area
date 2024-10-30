import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import LoginScreen from '../app/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { Alert } from 'react-native';
const wrapper = ({ children }) => {
    return children;
};

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = jest.fn();
    return Reanimated;
});

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient',
}));

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({
        replace: mockReplace,
        push: jest.fn(),
    }),
}));

jest.mock('expo-auth-session/providers/google', () => ({
    useAuthRequest: jest.fn(() => [null, null, jest.fn().mockResolvedValue({ type: 'cancel' })])
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    rn.Alert.alert = jest.fn();
    return rn;
});

describe('LoginScreen', () => {
    let mockPromptAsync;
    let mockUseAuthRequest;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPromptAsync = jest.fn();
        mockUseAuthRequest = jest.fn().mockReturnValue([null, null, mockPromptAsync]);
        jest.spyOn(Google, 'useAuthRequest').mockImplementation(mockUseAuthRequest);

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'fake-google-token-123' }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(<LoginScreen />, { wrapper });
        expect(getByText('Welcome')).toBeTruthy();
        expect(getByText('Connect to your account')).toBeTruthy();
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByText('Login')).toBeTruthy();
    });

    it('should handle successful login', async () => {
        const mockToken = 'fake-token-123';

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: mockToken }),
            })
        );

        const { getByPlaceholderText, getByText } = render(<LoginScreen />, { wrapper });

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Login');

    await act(async () => {
      fireEvent.changeText(emailInput, "test@example.com");
    });

        await act(async () => {
            fireEvent.changeText(passwordInput, 'password123');
        });

        await act(async () => {
            fireEvent.press(loginButton);
        });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        }),
      );

      expect(AsyncStorage.setItem).toHaveBeenCalledWith("userToken", mockToken);

      expect(mockReplace).toHaveBeenCalledWith("/(auth)/");
    });
  });

    it('should handle login failure', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Invalid credentials' }),
            })
        );

        const { getByPlaceholderText, getByText } = render(<LoginScreen />, { wrapper });

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByText('Login');

        await act(async () => {
            fireEvent.changeText(emailInput, 'test@example.com');
            fireEvent.changeText(passwordInput, 'wrongpassword');
            fireEvent.press(loginButton);
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Unable to login. Please check your credentials.'
            );
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    it('should navigate to signup screen when signup button is pressed', async () => {
        const mockPush = jest.fn();
        jest.spyOn(require('expo-router'), 'useRouter').mockImplementation(() => ({
            replace: mockReplace,
            push: mockPush,
        }));

        const { getByText } = render(<LoginScreen />, { wrapper });
        const signupButton = getByText('Sign Up');

        await act(async () => {
            fireEvent.press(signupButton);
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/Signup');
        });
    });

    it('should apply correct container styles', () => {
        const { getByTestId } = render(<LoginScreen />, { wrapper });
        const safeAreaView = getByTestId('login-container');

        expect(safeAreaView.props.style).toEqual(
            expect.objectContaining({
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            })
        );
    });

    it('should apply correct title styles', () => {
        const { getByTestId } = render(<LoginScreen />, { wrapper });
        const title = getByTestId('welcome-title');

        expect(title.props.style).toEqual(
            expect.objectContaining({
                fontSize: 40,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 10,
            })
        );
    });

    it('should apply correct Google button styles', () => {
        const { getByTestId } = render(<LoginScreen />, { wrapper });
        const googleButton = getByTestId('google-button');

    expect(googleButton.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: "#4285F4",
        borderRadius: 25,
        padding: 15,
        alignItems: "center",
        marginBottom: 10,
      }),
    );
  });
});

const waitForAnimations = () => new Promise(resolve => setTimeout(resolve, 0));

describe('LoginScreen Google Authentication', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should handle Google authentication failure', async () => {
        const mockPromptAsync = jest.fn().mockResolvedValue({ type: 'cancel' });
        jest.spyOn(Google, 'useAuthRequest').mockImplementation(() => [
            null,
            null,
            mockPromptAsync
        ]);

        const { getByTestId } = render(<LoginScreen />, { wrapper });

        await act(async () => {
            fireEvent.press(getByTestId('google-button'));
            await new Promise(resolve => setTimeout(resolve, 50)); // Attente pour le mock
        });

        await waitFor(() => {
            expect(mockPromptAsync).toHaveBeenCalled();
            expect(global.fetch).not.toHaveBeenCalled();
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });

    it('should handle Google authentication failure', async () => {
        const mockPromptAsync = jest.fn().mockResolvedValue({ type: 'cancel' });
        jest.spyOn(Google, 'useAuthRequest').mockImplementation(() => [
            null,
            null,
            mockPromptAsync
        ]);

        const { getByTestId } = render(<LoginScreen />, { wrapper });

        await act(async () => {
            await waitForAnimations();
            fireEvent.press(getByTestId('google-button'));
            await waitForAnimations();
        });

        expect(mockPromptAsync).toHaveBeenCalled();
        expect(global.fetch).not.toHaveBeenCalled();
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        expect(mockReplace).not.toHaveBeenCalled();
    });

});
