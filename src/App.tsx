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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/contests" element={<ContestsList />} />
              <Route path="/contest/:id" element={<Contest />} />
              <Route path="/points" element={<Points />} />
              <Route path="/prizes" element={<Prizes />} />
              <Route path="/quiz-completion/:contestId" element={<QuizCompletion />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;