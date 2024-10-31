import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import ServiceConnectionsScreen from "@/app/(auth)/profile/authorization/index";
import { ServiceCard } from "@/app/(auth)/profile/authorization";

// Mock de Linking
jest.mock("react-native/Libraries/Linking/Linking", () => ({
    openURL: jest.fn(),
}));

// Mock des icons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: ({ name, size, color }) => `Icon-${name}-${size}-${color}`,
}));

describe('ServiceConnectionsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all service cards', () => {
        const { getByText } = render(<ServiceConnectionsScreen />);

        // Vérifie la présence des titres des services
        expect(getByText('Google')).toBeTruthy();
        expect(getByText('Atlassian')).toBeTruthy();
        expect(getByText('GitHub')).toBeTruthy();
        expect(getByText('Spotify')).toBeTruthy();
    });

    it('renders title and subtitle', () => {
        const { getByText } = render(<ServiceConnectionsScreen />);

        expect(getByText('Connexions des Services')).toBeTruthy();
        expect(getByText('Connectez-vous à vos services préférés via notre version web')).toBeTruthy();
    });

    it('displays web only badge for each service', () => {
        const { getAllByText } = render(<ServiceConnectionsScreen />);

        const webOnlyBadges = getAllByText('Web Only');
        expect(webOnlyBadges).toHaveLength(4); // Un badge pour chaque service
    });

    it('opens correct URLs when clicking on web buttons', () => {
        const { getAllByText } = render(<ServiceConnectionsScreen />);

        const openButtons = getAllByText('Ouvrir dans le navigateur');

        // Test chaque bouton
        fireEvent.press(openButtons[0]); // Google
        expect(Linking.openURL).toHaveBeenCalledWith(
            'https://127.0.0.1:8081/profile/authorizations/login/oauth/google'
        );

        fireEvent.press(openButtons[1]); // Atlassian
        expect(Linking.openURL).toHaveBeenCalledWith(
            'https://127.0.0.1:8081/profile/authorizations/login/oauth/atlassian'
        );
    });
});

describe('ServiceCard', () => {
    const defaultProps = {
        name: 'Test Service',
        description: 'Test Description',
        icon: 'test-icon',
        webUrl: 'https://test.com',
        customColor: '#123456'
    };

    it('renders service information correctly', () => {
        const { getByText } = render(
            <ServiceCard {...defaultProps} />
        );

        expect(getByText('Test Service')).toBeTruthy();
        expect(getByText('Test Description')).toBeTruthy();
        expect(getByText('Web Only')).toBeTruthy();
    });

    it('opens URL when web button is pressed', () => {
        const { getByText } = render(
            <ServiceCard {...defaultProps} />
        );

        const button = getByText('Ouvrir dans le navigateur');
        fireEvent.press(button);

        expect(Linking.openURL).toHaveBeenCalledWith('https://test.com');
    });

    it('displays information message', () => {
        const { getByText } = render(
            <ServiceCard {...defaultProps} />
        );
        expect(getByText('Cette fonctionnalité est disponible uniquement sur la version web de l\'\application')).toBeTruthy();
    });
});