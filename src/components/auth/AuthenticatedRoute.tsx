import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const AuthenticatedRoute = ({ children, requireAdmin = false }: AuthenticatedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        console.log('No user detected, redirecting to login');
        toast({
          title: "Session expirée",
          description: "Veuillez vous reconnecter",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      if (requireAdmin && !isAdmin) {
        console.log('User is not admin, redirecting to dashboard');
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits nécessaires",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }
    }
  }, [user, isAdmin, isLoading, navigate, toast, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;