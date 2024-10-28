// src/lib/store/errorMessage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { errorMessage, setError, clearError } from '../../../lib/store/errorMessage';

describe('errorMessage store', () => {
    beforeEach(() => {
        // Reset the store to its initial state before each test
        errorMessage.set(null);
    });

    it('should have initial state of null', () => {
        const initialState = get(errorMessage);
        expect(initialState).toBeNull();
    });

    it('should set error message', () => {
        const testMessage = 'Test error message';
        setError(testMessage);
        const state = get(errorMessage);
        expect(state).toBe(testMessage);
    });

    it('should clear error message', () => {
        // First set an error
        setError('Test error');
        expect(get(errorMessage)).toBe('Test error');

        // Then clear it
        clearError();
        const state = get(errorMessage);
        expect(state).toBeNull();
    });

    it('should handle empty string error message', () => {
        setError('');
        const state = get(errorMessage);
        expect(state).toBe('');
    });

    it('should handle multiple error messages in sequence', () => {
        setError('First error');
        expect(get(errorMessage)).toBe('First error');

        setError('Second error');
        expect(get(errorMessage)).toBe('Second error');

        clearError();
        expect(get(errorMessage)).toBeNull();
    });

    it('should handle clearing when already null', () => {
        expect(get(errorMessage)).toBeNull();
        clearError();
        expect(get(errorMessage)).toBeNull();
    });

    it('should handle special characters in error message', () => {
        const specialMessage = 'Error!@#$%^&*()_+';
        setError(specialMessage);
        expect(get(errorMessage)).toBe(specialMessage);
    });
});