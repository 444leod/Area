import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SignUpScreen from '../app/Signup';
const wrapper = ({ children }) => {
    return children;
};

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
}));

describe('Signup screen', () => {

    it('should disable the sign up button while loading', async () => {
        const { getByText, getByTestId } = render(<SignUpScreen />, { wrapper });

        await act(async () => {
            fireEvent.changeText(getByTestId('firstName'), 'John');
            fireEvent.changeText(getByTestId('lastName'), 'Doe');
            fireEvent.changeText(getByTestId('email'), 'john.doe@example.com');
            fireEvent.changeText(getByTestId('password'), 'password123');
        });
        fireEvent.press(getByText('S\'inscrire'));

        await waitFor(() => expect(getByText('S\'inscrire')).toBeDisabled());
    });
});