import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/App';
import { useToast } from './use-toast';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAndCreateProfile = async (userId: string, email: string) => {
    const { data: existingProfile } = await supabase
      .from('members')
      .select()
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('members')
        .insert([
          {
            id: userId,
            email: email,
            first_name: email.split('@')[0],
            last_name: 'Utilisateur',
            role: email === 'renaudcanuel@me.com' ? 'admin' : 'user'
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de créer votre profil. Veuillez réessayer.",
        });
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profileCreated = await checkAndCreateProfile(
          session.user.id,
          session.user.email || ''
        );

        if (!profileCreated) {
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        if (session.user.email === 'renaudcanuel@me.com') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return { checkAndCreateProfile };
};