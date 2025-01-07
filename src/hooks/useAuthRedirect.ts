import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/App';
import { useToast } from './use-toast';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAndCreateProfile = async (userId: string, email: string) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('members')
        .select()
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('members')
          .insert([
            {
              id: userId,
              email: email,
              first_name: email.split('@')[0],
              last_name: 'New',
              role: email === 'renaudcanuel@me.com' ? 'admin' : 'user'
            }
          ]);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        toast({
          title: "Profil créé",
          description: "Votre profil a été créé avec succès.",
        });
      }

      return true;
    } catch (error) {
      console.error('Profile management error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de gérer votre profil. Veuillez réessayer.",
      });
      return false;
    }
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
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return { checkAndCreateProfile };
};