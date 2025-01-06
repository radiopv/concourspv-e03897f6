import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/App";
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
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error.message);
          return;
        }

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Check if user has a profile
          const { data: profile, error: profileError } = await supabase
            .from('members')
            .select('*')
            .eq('id', currentSession.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
          }

          // If no profile exists, create one
          if (!profile) {
            const { error: createError } = await supabase
              .from('members')
              .insert([
                {
                  id: currentSession.user.id,
                  email: currentSession.user.email,
                  first_name: currentSession.user.email?.split('@')[0] || 'User',
                  last_name: 'New',
                  role: currentSession.user.email === 'renaudcanuel@me.com' ? 'admin' : 'user'
                }
              ]);

            if (createError) {
              console.error("Error creating profile:", createError);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state changed:", event);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        // Redirect based on role
        if (currentSession.user.email === 'renaudcanuel@me.com') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setSession(null);
        setUser(null);
        navigate('/login');
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      
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