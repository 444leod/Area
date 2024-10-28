import { describe, it, expect } from 'vitest';
import { getIconForApp } from '../../../lib/utils/getIconName';

describe('getIconName', () => {
    it('should return the correct icon name for existing apps', () => {
        // Test plusieurs apps existants
        expect(getIconForApp('mail')).toBe('material-symbols:mail');
        expect(getIconForApp('github')).toBe('logos:github-icon');
        expect(getIconForApp('google')).toBe('logos:google-icon');

        // Tester la casse (majuscules/minuscules)
        expect(getIconForApp('MAIL')).toBe('material-symbols:mail');
        expect(getIconForApp('Mail')).toBe('material-symbols:mail');
    });

    it('should return default icon for non-existing apps', () => {
        // Test avec des apps qui n'existent pas dans iconMap
        expect(getIconForApp('nonexistent')).toBe('mdi:application');
        expect(getIconForApp('')).toBe('mdi:application');
        expect(getIconForApp('random-app')).toBe('mdi:application');
    });
});