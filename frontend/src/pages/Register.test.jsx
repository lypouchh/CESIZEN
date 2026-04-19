import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Register from './Register';
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

describe('Register page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('prevents submit when terms are not accepted', async () => {
    const registerMock = vi.fn();
    useAuth.mockReturnValue({ register: registerMock });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /Créer mon compte/i }));

    expect(await screen.findByText(/Veuillez accepter les conditions d'utilisation/i)).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
  });

  test('submits register form and navigates on success', async () => {
    const registerMock = vi.fn().mockResolvedValue(true);
    useAuth.mockReturnValue({ register: registerMock });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText('Prénom'), 'Jean');
    await userEvent.type(screen.getByLabelText('Nom'), 'Dupont');
    await userEvent.type(screen.getByLabelText(/Adresse e-mail/i), 'jean@example.com');
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'password123');
    await userEvent.type(screen.getByLabelText(/Confirmation du mot de passe/i), 'password123');
    await userEvent.click(screen.getByLabelText(/J'accepte les/i));
    await userEvent.click(screen.getByRole('button', { name: /Créer mon compte/i }));

    expect(registerMock).toHaveBeenCalledWith('Jean', 'Dupont', 'jean@example.com', 'password123', 'password123');
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
