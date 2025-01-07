import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { ProfileForm } from "./ProfileForm";
import { useQuery } from "@tanstack/react-query";

interface ExtendedProfileProps {
  userProfile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
    facebook_profile_url?: string;
    street_address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    bio?: string;
    total_points?: number;
    contests_won?: number;
  } | null;
  onUpdate: () => void;
}

export const ExtendedProfileCard = ({ userProfile, onUpdate }: ExtendedProfileProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    facebook_profile_url: userProfile?.facebook_profile_url || "",
    street_address: userProfile?.street_address || "",
    city: userProfile?.city || "",
    postal_code: userProfile?.postal_code || "",
    country: userProfile?.country || "France",
    bio: userProfile?.bio || "",
  });

  // Fetch user profile data with proper error handling
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de charger votre profil. Veuillez réessayer.",
          });
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Chargement du profil...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile && !userProfile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Profil non trouvé
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentProfile = profile || userProfile;

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('members')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      });
      
      onUpdate();
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la photo.",
      });
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('members')
        .update(formData)
        .eq('id', currentProfile.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profil Détaillé</span>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              Modifier le profil
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfileHeader 
          userProfile={currentProfile} 
          onPhotoUpload={handlePhotoUpload} 
        />

        <ProfileForm 
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
        />

        <ProfileStats 
          total_points={currentProfile.total_points}
          contests_won={currentProfile.contests_won}
        />

        {isEditing && (
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};