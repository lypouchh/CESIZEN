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

  test('loads users and hides current user from the table', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: [
          { id: 1, firstname: 'Admin', lastname: 'User', email: 'admin@example.com', id_role: 1, isActive: true, role: { nom: 'admin' } },
          { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
        ],
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
    expect(screen.queryByText('admin@example.com')).not.toBeInTheDocument();
  });

  test('toggles user status', async () => {
    const api = {
      get: vi.fn().mockResolvedValue({
        data: [
          { id: 2, firstname: 'Alice', lastname: 'Demo', email: 'alice@example.com', id_role: 2, isActive: true, role: { nom: 'user' } },
        ],
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
});
