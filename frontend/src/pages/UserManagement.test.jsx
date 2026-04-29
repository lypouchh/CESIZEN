import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import UserManagement from './UserManagement';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('UserManagement page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loads users and shows current user in the table', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: {
          users: [
            { id: 1, firstname: 'Admin', lastname: 'User', email: 'admin@example.com', id_role: 1, isActive: true, role: { nom: 'admin' } },
            { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
          ],
          currentAdmin: { id: 1, isSuperAdmin: false },
        },
      }),
      put: vi.fn(),
      delete: vi.fn(),
    };

    useAuth.mockReturnValue({
      api,
      user: { id: 1 },
    });

    render(<UserManagement />);

    expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Admin \(vous\)/i)).toBeInTheDocument();
  });

  test('toggles user status', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: {
          users: [
            { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
          ],
          currentAdmin: { id: 99, isSuperAdmin: false },
        },
      }),
      put: vi.fn().mockResolvedValue({
        data: { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: false, role: { nom: 'user' } },
      }),
      delete: vi.fn(),
    };

    useAuth.mockReturnValue({
      api,
      user: { id: 99 },
    });

    render(<UserManagement />);

    const toggleButton = await screen.findByRole('button', { name: /Désactiver/i });
    await userEvent.click(toggleButton);

    expect(api.put).toHaveBeenCalledWith('/admin/users/2/status');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Activer/i })).toBeInTheDocument();
    });
  });

  test('shows create-admin form for super admin and submits it', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: {
          users: [
            { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
          ],
          currentAdmin: { id: 1, isSuperAdmin: true },
        },
      }),
      put: vi.fn(),
      delete: vi.fn(),
      post: vi.fn().mockResolvedValue({
        data: {
          user: { id: 3, firstname: 'New', lastname: 'Admin', email: 'newadmin@example.com', id_role: 1, isActive: true, role: { nom: 'admin' } },
        },
      }),
    };

    useAuth.mockReturnValue({
      api,
      user: { id: 1 },
    });

    render(<UserManagement />);

    expect(await screen.findByText(/Créer un admin subordonné/i)).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText('Prénom'), 'New');
    await userEvent.type(screen.getByPlaceholderText('Nom'), 'Admin');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'newadmin@example.com');
    await userEvent.type(screen.getByPlaceholderText('Mot de passe'), 'password123');
    await userEvent.type(screen.getByPlaceholderText(/Confirmation du mot de passe/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Créer l'admin/i }));

    expect(api.post).toHaveBeenCalledWith('/admin/admins', {
      firstname: 'New',
      lastname: 'Admin',
      email: 'newadmin@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    });

    expect(await screen.findByText(/Admin subordonné créé avec succès/i)).toBeInTheDocument();
  });

  test('shows load error when users request fails', async () => {
    const api = {
      get: vi.fn().mockRejectedValue({ response: { data: { message: 'Erreur de chargement' } } }),
      put: vi.fn(),
      delete: vi.fn(),
    };

    useAuth.mockReturnValue({
      api,
      user: { id: 1 },
    });

    render(<UserManagement />);

    expect(await screen.findByText(/Impossible de charger les utilisateurs/i)).toBeInTheDocument();
  });

  test('does not show create-admin form for non super admin', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: {
          users: [
            { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
          ],
          currentAdmin: { id: 99, isSuperAdmin: false },
        },
      }),
      put: vi.fn(),
      delete: vi.fn(),
      post: vi.fn(),
    };

    useAuth.mockReturnValue({
      api,
      user: { id: 99 },
    });

    render(<UserManagement />);

    expect(await screen.findByText('alice@example.com')).toBeInTheDocument();
    expect(screen.queryByText(/Créer un admin subordonné/i)).not.toBeInTheDocument();
    expect(screen.getByText(/vous ne pouvez pas créer d'autre admin/i)).toBeInTheDocument();
  });
});
