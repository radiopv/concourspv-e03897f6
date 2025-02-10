
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Instructions from '@/pages/Instructions';
import ContestsList from '@/pages/ContestsList';
import Contest from '@/pages/Contest';
import Points from '@/pages/Points';
import Prizes from '@/pages/Prizes';
import QuizCompletion from '@/pages/QuizCompletion';
import Admin from '@/pages/Admin';
import Campeones from '@/pages/Campeones';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<ContestsList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/contests" element={<ContestsList />} />
              <Route path="/contest/:id" element={<Contest />} />
              <Route path="/points" element={<Points />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/campeones" element={<Campeones />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/quiz-completion/:contestId" element={<ProtectedRoute><QuizCompletion /></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
