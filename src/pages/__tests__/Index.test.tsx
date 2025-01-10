import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderIndex = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Index />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Index Page', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('affiche le titre principal', () => {
    renderIndex();
    expect(screen.getByText(/Concours Actifs/i)).toBeInTheDocument();
  });

  it('affiche le skeleton loader pendant le chargement', () => {
    renderIndex();
    const loadingSection = screen.getByRole('status');
    expect(loadingSection).toBeInTheDocument();
  });
});