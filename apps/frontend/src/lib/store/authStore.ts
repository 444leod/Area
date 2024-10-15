import { writable } from 'svelte/store';

export const authStore = writable(false);

export const login = () => {
    authStore.set(true);
};

export const logout = () => {
    authStore.set(false);
};