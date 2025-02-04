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
        // Récupérer la session actuelle
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error fetching session:", sessionError.message);
          throw sessionError;
        }

        if (currentSession) {
          const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError) {
            console.error("Error fetching user:", userError.message);
            throw userError;
          }

          if (currentUser) {
            setSession(currentSession);
            setUser(currentUser);
            
            // Mettre à jour la persistance de la session
            await supabase.auth.setSession({
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
            });
          } else {
            await signOut();
          }
        } else {
          setSession(null);
          setUser(null);
          
          // Rediriger vers login si sur une route protégée
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

    // Vérification initiale de la session
    checkSession();

    // Configuration du listener pour les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        // Nettoyer les données de session
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
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Rafraîchir la persistance de la session
          await supabase.auth.setSession({
            access_token: currentSession.access_token,
            refresh_token: currentSession.refresh_token,
          });
        }
      }
      
      setLoading(false);
    });

    // Nettoyage de la souscription lors du démontage
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      // Nettoyer d'abord les données locales
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      
      // Puis tenter la déconnexion de Supabase
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
      // Même en cas d'erreur, on veut nettoyer la session locale
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