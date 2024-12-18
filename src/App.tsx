import { createClient } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Admin from './pages/Admin';
import AdminParticipants from './pages/AdminParticipants';
import AdminPrizes from './pages/AdminPrizes';
import Contest from './pages/Contest';
import ContestStats from './pages/ContestStats';
import ContestsList from './pages/ContestsList';
import Dashboard from './pages/Dashboard';
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Index /></Layout>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/dashboard',
    element: <Layout><Dashboard /></Layout>
  },
  {
    path: '/contests',
    element: <Layout><ContestsList /></Layout>
  },
  {
    path: '/contest/:id',
    element: <Layout><Contest /></Layout>
  },
  {
    path: '/contest/:id/stats',
    element: <Layout><ContestStats /></Layout>
  },
  {
    path: '/admin',
    element: <Layout><Admin /></Layout>
  },
  {
    path: '/admin/participants',
    element: <Layout><AdminParticipants /></Layout>
  },
  {
    path: '/admin/prizes',
    element: <Layout><AdminPrizes /></Layout>
  }
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
