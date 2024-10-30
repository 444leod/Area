import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from '../../app/(auth)/index';
import { AreaItem } from '@/components/AreaItem';
const wrapper = ({ children }) => {
    return children;
};

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@/components/AreaItem', () => ({
    AreaItem: jest.fn(({ item }) => <>{item.name}</>),
}));

jest.spyOn(global, 'fetch').mockImplementation(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
            { id: '1', name: 'Area 1', type: 'email', active: true },
            { id: '2', name: 'Area 2', type: 'calendar', active: false },
        ]),
    })
);

describe('Dashboard screen', () => {
    it('displays areas correctly', async () => {
        render(<DashboardScreen />);

        await waitFor(() => {
            const elements = screen.getAllByText(/Area/);
            console.log('Found elements:', elements.map(el => el.props.children));
            expect(screen.getByText('Area 1')).toBeTruthy();
            expect(screen.getByText('Area 2')).toBeTruthy();
        });
    });
});