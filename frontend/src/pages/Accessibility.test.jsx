import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';
import Register from './Register';
import Exercise from './Exercise';
import LoggedOut from './LoggedOut';
import Profile from './Profile';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Frontend accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('login page has no obvious accessibility violations', async () => {
    useAuth.mockReturnValue({ login: vi.fn() });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('register page has no obvious accessibility violations', async () => {
    useAuth.mockReturnValue({ register: vi.fn() });

    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('exercise page has no obvious accessibility violations', async () => {
    useAuth.mockReturnValue({ user: null, api: { post: vi.fn() } });

    const { container } = render(<Exercise />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('logged out page has no obvious accessibility violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoggedOut />
      </MemoryRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('profile page has no obvious accessibility violations', async () => {
    useAuth.mockReturnValue({
      user: { id: 1, firstname: 'Jean', lastname: 'Dupont', email: 'jean@example.com' },
      logout: vi.fn(),
      updateUser: vi.fn(),
      deleteAccount: vi.fn(),
      api: { get: vi.fn().mockResolvedValue({ data: [] }) },
    });

    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await screen.findByRole('heading', { name: /Mon Profil/i });
    await screen.findByText(/Aucune séance enregistrée pour le moment/i);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});