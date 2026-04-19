import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Exercise from './Exercise';
import { useAuth } from '../contexts/AuthContext';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('Exercise page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: null });
  });

  test('renders default mode and repetitions', () => {
    render(<Exercise />);

    expect(screen.getByText(/Mode : Équilibre \(5-5\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de répétitions/i)).toHaveValue(5);
  });

  test('updates repetitions and keeps it within accepted range', async () => {
    render(<Exercise />);

    const repetitions = screen.getByLabelText(/Nombre de répétitions/i);

    await userEvent.clear(repetitions);
    await userEvent.type(repetitions, '30');
    expect(repetitions).toHaveValue(20);

    fireEvent.change(repetitions, { target: { value: '0' } });
    expect(repetitions).toHaveValue(1);
  });

  test('switches breathing mode label when mode changes', async () => {
    render(<Exercise />);

    await userEvent.click(screen.getByRole('button', { name: '4-6' }));
    expect(screen.getByText(/Mode : Relaxation \(4-6\)/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '7-4-8' }));
    expect(screen.getByText(/Mode : Sommeil \(7-4-8\)/i)).toBeInTheDocument();
  });

  test('starts and stops an exercise session', async () => {
    render(<Exercise />);

    const actionButton = screen.getByRole('button', { name: /Commencer la séance/i });
    await userEvent.click(actionButton);

    expect(screen.getByRole('button', { name: /Arrêter l'exercice/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre de répétitions/i)).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: /Arrêter l'exercice/i }));
    expect(screen.getByRole('button', { name: /Commencer la séance/i })).toBeInTheDocument();
  });

  test('shows autosave helper text for authenticated users', () => {
    useAuth.mockReturnValue({ user: { id: 12 } });

    render(<Exercise />);

    expect(screen.getByText(/Vos sessions sont automatiquement sauvegardées/i)).toBeInTheDocument();
  });
});
