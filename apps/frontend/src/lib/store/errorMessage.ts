import { writable } from 'svelte/store';

export const errorMessage = writable<string | null>(null);

export function setError(message: string) {
    errorMessage.set(message);
}

export function clearError() {
    errorMessage.set(null);
}