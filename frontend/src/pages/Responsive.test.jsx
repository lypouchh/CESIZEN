import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Exercise from './Exercise';
import LoggedOut from './LoggedOut';
import UserManagement from './UserManagement';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function findElementByClasses(container, classes) {
  return Array.from(container.querySelectorAll('*')).find((element) =>
    classes.every((className) => element.className?.split(' ').includes(className))
  );
}

describe('Frontend responsive structure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('login page keeps a constrained centered card on large screens and full width on mobile', () => {
    useAuth.mockReturnValue({ login: vi.fn() });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const card = screen.getByRole('heading', { name: /Connexion/i }).closest('section');
    const wrapper = card?.parentElement;

    expect(wrapper).toHaveClass('px-4');
    expect(card).toHaveClass('w-full', 'max-w-xl');
  });

  test('register page uses a mobile first grid that expands to two columns', () => {
    useAuth.mockReturnValue({ register: vi.fn() });

    const { container } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const identityGrid = findElementByClasses(container, ['grid', 'gap-4', 'md:grid-cols-2']);
    const submitButton = screen.getByRole('button', { name: /Créer mon compte/i });

    expect(identityGrid).toBeInTheDocument();
    expect(submitButton).toBeVisible();
  });

  test('profile page exposes mobile padding and responsive action columns', async () => {
    useAuth.mockReturnValue({
      user: { id: 7, firstname: 'Jean', lastname: 'Dupont', email: 'jean@example.com' },
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

    const pageWrapper = findElementByClasses(container, ['min-h-[90vh]', 'px-4', 'sm:px-6', 'lg:px-8']);
    const actionGrid = findElementByClasses(container, ['grid', 'gap-4', 'md:grid-cols-2']);

    expect(pageWrapper).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    expect(actionGrid).toBeInTheDocument();
  });

  test('exercise page uses a responsive content grid with a fixed side panel on desktop', () => {
    useAuth.mockReturnValue({ user: null, api: { post: vi.fn() } });

    const { container } = render(<Exercise />);

    const mainGrid = findElementByClasses(container, ['grid', 'gap-8', 'md:grid-cols-[1fr_320px]']);
    const repetitions = screen.getByLabelText(/Nombre de répétitions/i);

    expect(mainGrid).toBeInTheDocument();
    expect(repetitions).toHaveClass('w-full');
  });

  test('logged out page keeps a centered constrained card for small and large screens', () => {
    const { container } = render(
      <MemoryRouter>
        <LoggedOut />
      </MemoryRouter>
    );

    const card = screen.getByRole('heading', { name: /Vous avez bien ete deconnecte/i }).closest('div');

    expect(card).toHaveClass('w-full', 'max-w-xl', 'text-center');
    expect(container.firstChild).toHaveClass('px-6');
  });

  test('user management page uses stacked then two-column layout for sub-admin form', async () => {
    useAuth.mockReturnValue({
      api: {
        get: vi.fn().mockResolvedValue({
          data: {
            users: [],
            currentAdmin: { id: 1, isSuperAdmin: true },
          },
        }),
        put: vi.fn(),
        delete: vi.fn(),
        post: vi.fn(),
      },
      user: { id: 1 },
    });

    const { container } = render(<UserManagement />);

    await screen.findByText(/Créer un admin subordonné/i);
    const formGrid = findElementByClasses(container, ['grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-3']);

    expect(formGrid).toBeInTheDocument();
  });
});