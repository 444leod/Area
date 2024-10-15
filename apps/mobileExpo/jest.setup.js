import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient',
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: 'SafeAreaView',
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        replace: jest.fn(),
        push: jest.fn(),
    }),
}));

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return {
        ...Reanimated,
        FadeIn: { duration: () => ({ springify: jest.fn() }) },
        FadeInUp: { duration: () => ({ springify: jest.fn() }) },
        FadeInDown: { duration: () => ({ springify: jest.fn() }) },
    };
});

jest.mock('expo-auth-session/providers/google', () => ({
    useAuthRequest: () => [null, null, jest.fn()],
}));

jest.mock('expo-web-browser', () => ({
    maybeCompleteAuthSession: jest.fn(),
}));

jest.mock('react-native-reanimated', () => 'Animated');