import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../App';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider: Initializing");
    
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }

        console.log("Initial session:", currentSession);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Auth initialization error:", error);
        toast({
          title: "Erreur d'authentification",
          description: "Une erreur est survenue lors de l'initialisation de la session",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        console.log("Current session:", currentSession?.user?.email);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Vérifier et créer le profil si nécessaire
          const { data: profile, error: profileError } = await supabase
            .from('members')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }

          if (!profile) {
            console.log("Creating new profile for user:", currentSession.user.email);
            const { error: createError } = await supabase
              .from('members')
              .insert([
                {
                  id: currentSession.user.id,
                  email: currentSession.user.email,
                  first_name: currentSession.user.email?.split('@')[0] || '',
                  last_name: 'New',
                  role: currentSession.user.email === 'renaudcanuel@me.com' ? 'admin' : 'user'
                }
              ]);

            if (createError) {
              console.error("Error creating profile:", createError);
              toast({
                title: "Erreur",
                description: "Impossible de créer votre profil",
                variant: "destructive"
              });
            }
          }

          // Rediriger uniquement lors de la connexion initiale
          if (event === 'SIGNED_IN') {
            console.log("User signed in, redirecting...");
            if (currentSession.user.email === 'renaudcanuel@me.com') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }
        } else {
          console.log("No session, clearing user state");
          setSession(null);
          setUser(null);
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
      }
    );

    return () => {
      console.log("Cleaning up auth subscriptions");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};