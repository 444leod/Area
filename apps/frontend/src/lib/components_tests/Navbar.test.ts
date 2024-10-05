import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Navbar from '$lib/components/Navbar.svelte';
import '@testing-library/jest-dom';

// Mock SvelteKit modules
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
}));

// Mock external components
vi.mock('@skeletonlabs/skeleton', () => ({
  LightSwitch: vi.fn(() => ({
    $$: { fragment: document.createDocumentFragment() },
    $set: vi.fn(),
    $destroy: vi.fn()
  }))
}));

// Mock Lucide icons
vi.mock('lucide-svelte', () => ({
  LogIn: vi.fn(),
  UserPlus: vi.fn(),
  Menu: vi.fn(),
  X: vi.fn(),
}));

describe('Navbar component', () => {
  beforeEach(() => {
    const { container } = render(Navbar);
    document.body.appendChild(container);
  });

  it('renders the logo text', () => {
    expect(screen.getByTestId('logo')).toHaveTextContent("Boogie's Area");
  });

  it('renders login and signup buttons on desktop', () => {
    expect(screen.getByTestId('desktop-login-button')).toHaveTextContent('Login');
    expect(screen.getByTestId('desktop-signup-button')).toHaveTextContent('Sign Up');
  });

  it('renders the light switch', () => {
    expect(screen.getByTestId('desktop-light-switch')).toBeInTheDocument();
  });

  it('renders the mobile menu button', () => {
    expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', async () => {
    const menuButton = screen.getByTestId('mobile-menu-button');
    
    // Initially, mobile menu should be hidden
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // Click the menu button
    await fireEvent.click(menuButton);

    // Now the mobile menu should be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Click the menu button again
    await fireEvent.click(menuButton);

    // The mobile menu should be hidden again
    // We need to wait for the transition to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('closes mobile menu when a menu item is clicked', async () => {
    const menuButton = screen.getByTestId('mobile-menu-button');

    // Open the mobile menu
    await fireEvent.click(menuButton);

    // Click the Login button in the mobile menu
    const loginButton = screen.getByTestId('mobile-login-button');
    await fireEvent.click(loginButton);

    // We need to wait for the transition to complete
    await new Promise(resolve => setTimeout(resolve, 300));

    // The mobile menu should be hidden
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });
});