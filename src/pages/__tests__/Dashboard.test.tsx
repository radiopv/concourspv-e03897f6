import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Dashboard from '../Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    // Reset QueryClient
    queryClient.clear();
  });

  it('affiche le message de connexion quand non authentifié', () => {
    renderDashboard();
    expect(screen.getByText(/Veuillez vous connecter/i)).toBeInTheDocument();
  });

  it('affiche les skeletons pendant le chargement', () => {
    renderDashboard();
    const loadingSection = screen.getByRole('status');
    expect(loadingSection).toBeInTheDocument();
  });

  // Ajoutez plus de tests selon les besoins
});