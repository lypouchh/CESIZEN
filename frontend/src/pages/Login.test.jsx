import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';

const mockNavigate = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submits credentials and navigates to profile on success', async () => {
    const loginMock = vi.fn().mockResolvedValue(true);
    useAuth.mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Adresse e-mail/i), 'admin@cesizen.fr');
    await userEvent.type(screen.getByLabelText(/Mot de passe/i), 'admin12345');
    await userEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(loginMock).toHaveBeenCalledWith('admin@cesizen.fr', 'admin12345');
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });

  test('shows backend error message on failed login', async () => {
    const loginMock = vi.fn().mockRejectedValue({
      response: { data: { message: 'Les identifiants sont incorrects.' } },
    });
    useAuth.mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Adresse e-mail/i), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText(/Mot de passe/i), 'badpass');
    await userEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(await screen.findByText(/Les identifiants sont incorrects\./i)).toBeInTheDocument();
  });

  test('shows fallback error message when backend message is unavailable', async () => {
    const loginMock = vi.fn().mockRejectedValue(new Error('Network error'));
    useAuth.mockReturnValue({ login: loginMock });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Adresse e-mail/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/Mot de passe/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

    expect(await screen.findByText(/Impossible de se connecter\. Vérifiez le backend\./i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
