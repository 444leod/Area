import { writable } from 'svelte/store';

export const authStore = writable(false);

export const login = () => {
    console.log('Login function called');
    authStore.set(true);
};

export const logout = () => {
    console.log('Logout function called');
    authStore.set(false);
};