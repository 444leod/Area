import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewAreaScreen from '@/app/(auth)/newArea/index';

// Mock data
const mockServices = [
    {
        _id: '1',
        name: 'Email Service',
        actions: [
            {
                action_type: 'email_trigger',
                name: 'New Email',
                type: 'email',
                params: [
                    { name: 'subject', type: 'string', required: true }
                ],
                variables: ['sender', 'subject']
            }
        ],
        reactions: [
            {
                action_type: 'send_email',
                name: 'Send Email',
                type: 'email',
                params: [
                    { name: 'recipient', type: 'string', required: true },
                    { name: 'subject', type: 'string', required: true }
                ]
            }
        ]
    }
];

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve('fake-token')),
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        back: jest.fn(),
    }),
}));

global.fetch = jest.fn();

describe('NewAreaScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockServices)
            })
        );
    });

    it('fetches services on mount', async () => {
        render(<NewAreaScreen />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/services'),
                expect.any(Object)
            );
        });
    });

    it('displays services and allows selection', async () => {
        const { findByText } = render(<NewAreaScreen />);

        const emailService = await findByText('Email Service');
        fireEvent.press(emailService);

        await findByText('Select Trigger');
    });

    it('navigates through steps correctly', async () => {
        const { findByText } = render(<NewAreaScreen />);

        const nextButton = await findByText('Next');
        const backButton = await findByText('Back');

        fireEvent.press(nextButton);
        expect(await findByText('Step 2 of 6')).toBeTruthy();

        fireEvent.press(backButton);
        expect(await findByText('Step 1 of 6')).toBeTruthy();
    });

    it('validates required fields', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        const { findByText } = render(<NewAreaScreen />);

        // Navigate to last step without filling required fields
        for (let i = 0; i < 5; i++) {
            const nextButton = await findByText('Next');
            fireEvent.press(nextButton);
        }

        const activateButton = await findByText('Activate Automation');
        fireEvent.press(activateButton);

        expect(alertSpy).toHaveBeenCalledWith(
            'Validation Error',
            expect.stringContaining('Automation name is required'),
            expect.any(Array)
        );
    });

    it('creates new area successfully', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        (global.fetch as jest.Mock).mockImplementation((url) => {
            if (url.includes('/services')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockServices)
                });
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Success' })
            });
        });

        const { findByText, findByTestId } = render(<NewAreaScreen />);

        // Fill in automation name
        const nameInput = await findByTestId('automation-name-input');
        fireEvent.changeText(nameInput, 'Test Automation');

        // Navigate to last step
        for (let i = 0; i < 5; i++) {
            const nextButton = await findByText('Next');
            fireEvent.press(nextButton);
        }

        const activateButton = await findByText('Activate Automation');
        fireEvent.press(activateButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Success',
                'New AREA created successfully'
            );
        });
    });

    it('handles service fetch error', async () => {
        const alertSpy = jest.spyOn(Alert, 'alert');
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<NewAreaScreen />);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
                'Error',
                'Failed to fetch services'
            );
        });
    });

    it('renders input fields based on selected trigger/action', async () => {
        const { findByText, findByTestId } = render(<NewAreaScreen />);

        // Select email service
        const emailService = await findByText('Email Service');
        fireEvent.press(emailService);

        // Select trigger
        const triggerOption = await findByText('New Email');
        fireEvent.press(triggerOption);

        // Go to details step
        const nextButton = await findByText('Next');
        fireEvent.press(nextButton);

        // Verify input fields are rendered
        expect(await findByTestId('input-subject')).toBeTruthy();
    });

    it('updates dynamic variables correctly', async () => {
        const { findByText, findByTestId } = render(<NewAreaScreen />);

        // Navigate through setup
        const emailService = await findByText('Email Service');
        fireEvent.press(emailService);

        const triggerOption = await findByText('New Email');
        fireEvent.press(triggerOption);

        // Verify dynamic variables are available
        const subjectInput = await findByTestId('input-subject');
        expect(subjectInput.props.dynamicVariables).toContain('sender');
        expect(subjectInput.props.dynamicVariables).toContain('subject');
    });
});