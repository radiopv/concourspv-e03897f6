import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking current session...');
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          throw sessionError;
        }

        console.log('Session status:', currentSession ? 'Active session found' : 'No active session');

        if (currentSession) {
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("Error fetching user:", userError.message);
            throw userError;
          }

          if (currentUser) {
            console.log('User found:', currentUser.email);
            setSession(currentSession);
            setUser(currentUser);
            
            // Update session persistence
            await supabase.auth.setSession({
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
            });
          } else {
            console.log('No user found, signing out...');
            await signOut();
          }
        } else {
          console.log('No active session found');
          setSession(null);
          setUser(null);
          
          // Redirect to login if on a protected route
          if (window.location.pathname.startsWith('/dashboard') || 
              window.location.pathname.startsWith('/admin')) {
            navigate('/login');
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
        await signOut();
      } finally {
        setLoading(false);
      }
    };

    // Initial session check
    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clean up session data
        setSession(null);
        setUser(null);
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
        
        toast({
          title: "Session terminée",
          description: "Veuillez vous reconnecter.",
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession) {
          console.log('Setting new session for user:', currentSession.user?.email);
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Refresh session persistence
          await supabase.auth.setSession({
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
          });
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      // Clean up local data first
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      
      // Then attempt Supabase signout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        throw error;
      }
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if there's an error, we want to clean up the local session
      navigate('/login');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion, mais votre session a été réinitialisée.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};