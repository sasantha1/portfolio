jest.mock('./components/DisplacementSphere', () => ({
  DisplacementSphere: () => null,
}));

import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders hero and name', async () => {
  render(<App />);
  await waitFor(
    () => {
      expect(screen.getByRole('heading', { level: 1, name: /software/i })).toBeInTheDocument();
    },
    { timeout: 4000 }
  );
  await waitFor(() => {
    expect(screen.getByText(/sasantha sanju/i)).toBeInTheDocument();
  });
});
