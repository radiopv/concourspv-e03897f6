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
        // First, try to get the session from Supabase
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          throw sessionError;
        }

        if (currentSession) {
          // If we have a session, verify it's still valid
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("Error fetching user:", userError.message);
            throw userError;
          }

          if (currentUser) {
            setSession(currentSession);
            setUser(currentUser);
          } else {
            // User data not found, clear the session
            await signOut();
          }
        } else {
          // No session found, clear state
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
        // Clear state and redirect on error
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
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null);
        setUser(null);
        navigate('/login');
        toast({
          title: "Session terminée",
          description: "Veuillez vous reconnecter.",
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      
      // Clear any stored tokens
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      
      navigate('/login');
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
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