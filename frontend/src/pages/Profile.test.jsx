import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Profile from './Profile';
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

describe('Profile page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading state when user is null', () => {
    useAuth.mockReturnValue({
      user: null,
      logout: vi.fn(),
      updateUser: vi.fn(),
      deleteAccount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  test('updates profile when form is submitted', async () => {
    const updateUserMock = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({
      user: { id: 9, firstname: 'Old', lastname: 'Name', email: 'old@example.com' },
      logout: vi.fn(),
      updateUser: updateUserMock,
      deleteAccount: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const firstNameInput = screen.getByLabelText('Prénom');
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'New');
    await userEvent.click(screen.getByRole('button', { name: /Enregistrer les modifications/i }));

    expect(updateUserMock).toHaveBeenCalledWith({
      firstname: 'New',
      lastname: 'Name',
      email: 'old@example.com',
    });
    expect(await screen.findByText(/Profil mis à jour avec succès/i)).toBeInTheDocument();
  });

  test('deletes account when confirmed', async () => {
    const deleteAccountMock = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({
      user: { id: 1, firstname: 'Admin', lastname: 'User', email: 'admin@example.com' },
      logout: vi.fn(),
      updateUser: vi.fn(),
      deleteAccount: deleteAccountMock,
    });

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /Supprimer mon compte/i }));

    expect(deleteAccountMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('logs out and redirects to the logged out page', async () => {
    const logoutMock = vi.fn();
    useAuth.mockReturnValue({
      user: { id: 1, firstname: 'Admin', lastname: 'User', email: 'admin@example.com' },
      logout: logoutMock,
      updateUser: vi.fn(),
      deleteAccount: vi.fn(),
      api: { get: vi.fn().mockResolvedValue({ data: [] }) },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /Se déconnecter/i }));

    expect(logoutMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/logged-out');
  });

  test('shows no session message when dashboard has no sessions', async () => {
    useAuth.mockReturnValue({
      user: { id: 2, firstname: 'No', lastname: 'Session', email: 'none@example.com' },
      logout: vi.fn(),
      updateUser: vi.fn(),
      deleteAccount: vi.fn(),
      api: { get: vi.fn().mockResolvedValue({ data: [] }) },
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /Exercices/i }));
    expect(await screen.findByText(/Aucune séance enregistrée pour le moment/i)).toBeInTheDocument();
  });
});
