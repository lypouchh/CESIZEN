import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Articles from './Articles';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Articles page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders articles even when excerpt, author or content are missing', async () => {
    useAuth.mockReturnValue({
      user: null,
      api: {
        get: vi.fn().mockResolvedValue({
          data: [
            {
              id: 1,
              title: 'Article incomplet',
              content: null,
              excerpt: null,
              created_at: null,
              user: null,
            },
          ],
        }),
      },
    });

    render(
      <MemoryRouter>
        <Articles />
      </MemoryRouter>
    );

    expect(await screen.findByText('Article incomplet')).toBeInTheDocument();
    expect(screen.getByText('Contenu indisponible pour cet article.')).toBeInTheDocument();
    expect(screen.getByText('Par Auteur inconnu')).toBeInTheDocument();
    expect(screen.getByText('Date indisponible')).toBeInTheDocument();
  });
});
