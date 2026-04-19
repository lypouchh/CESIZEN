import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoggedOut from './LoggedOut';

describe('LoggedOut page', () => {
  test('shows disconnected confirmation content', () => {
    render(
      <MemoryRouter>
        <LoggedOut />
      </MemoryRouter>
    );

    expect(screen.getByText(/Vous avez bien ete deconnecte/i)).toBeInTheDocument();
    expect(screen.getByText(/Votre session a ete fermee en toute securite/i)).toBeInTheDocument();
  });

  test('contains a link to home page', () => {
    render(
      <MemoryRouter>
        <LoggedOut />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /Retourner a l'accueil/i });
    expect(link).toHaveAttribute('href', '/');
  });
});