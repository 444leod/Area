import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '../app/index';

// Add this mock
jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    rn.Animated.View = rn.View;
    return rn;
});

describe('LoginScreen', () => {
    it('renders without crashing', () => {
        console.log('Before render');
        const { debug } = render(<LoginScreen />);
        console.log('After render');
        debug(); // This will print the rendered component structure
    });
});