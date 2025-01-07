import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../App';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Vérifier et créer le profil si nécessaire
          const { data: profile } = await supabase
            .from('members')
            .select('*')
            .eq('id', currentSession.user.id)
            .single();

          if (!profile) {
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
            }
          }

          // Ne rediriger que lors de la connexion initiale
          if (event === 'SIGNED_IN') {
            if (currentSession.user.email === 'renaudcanuel@me.com') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }
        } else {
          setSession(null);
          setUser(null);
          navigate('/login');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
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