import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from '@tanstack/react-query';

interface ProfileCardProps {
  userProfile: {
    email: string;
    first_name: string;
    last_name: string;
    phone_number?: string;
    street_address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  isEditing: boolean;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    street_address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  setFormData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  userId: string;
  refetch: () => void;
}

const ProfileCard = ({ 
  userProfile, 
  isEditing, 
  formData, 
  setFormData, 
  setIsEditing,
  userId,
  refetch
}: ProfileCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form data with user profile when component mounts or userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        email: userProfile.email || '',
        phone_number: userProfile.phone_number || '',
        street_address: userProfile.street_address || '',
        city: userProfile.city || '',
        postal_code: userProfile.postal_code || '',
        country: userProfile.country || 'France'
      });
    }
  }, [userProfile, setFormData]);

  const handleSaveProfile = async () => {
    try {
      console.log("Début de la mise à jour du profil...");
      console.log("Données à mettre à jour:", formData);
      console.log("ID utilisateur:", userId);

      if (!userId) {
        throw new Error("ID utilisateur manquant");
      }

      // Mise à jour du profil dans la base de données
      const { error: dbError } = await supabase
        .from("members")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone_number: formData.phone_number,
          street_address: formData.street_address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country || 'France'
        })
        .eq("id", userId);

      if (dbError) {
        console.error("Erreur lors de la mise à jour du profil:", dbError);
        throw dbError;
      }

      // Si l'email a changé, mettre à jour l'email dans auth
      if (formData.email !== userProfile.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email,
        });

        if (authError) {
          console.error("Erreur lors de la mise à jour de l'email:", authError);
          throw authError;
        }
      }

      // Rafraîchir les données après la mise à jour
      await Promise.all([
        refetch(),
        queryClient.invalidateQueries({ queryKey: ['user-points'] }),
        queryClient.invalidateQueries({ queryKey: ['point-history'] })
      ]);
      
      toast({
        title: "Profil mis à jour",
        description: formData.email !== userProfile.email 
          ? "Vos informations ont été enregistrées. Si vous avez modifié votre email, veuillez vérifier votre boîte de réception pour confirmer le changement."
          : "Vos informations ont été enregistrées avec succès.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error("Erreur complète:", error);
      
      if (error.message?.includes("email_exists") || error.message?.includes("already been registered")) {
        toast({
          variant: "destructive",
          title: "Email déjà utilisé",
          description: "Cette adresse email est déjà associée à un autre compte.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
      });
    }
  };

  if (!userProfile) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Mon profil</CardTitle>
          <CardDescription>Chargement de vos informations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Mon profil</CardTitle>
        <CardDescription>Gérez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone_number || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.street_address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, street_address: e.target.value }))}
              disabled={!isEditing}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={formData.postal_code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    first_name: userProfile.first_name,
                    last_name: userProfile.last_name,
                    email: userProfile.email,
                    phone_number: userProfile.phone_number,
                    street_address: userProfile.street_address,
                    city: userProfile.city,
                    postal_code: userProfile.postal_code,
                    country: userProfile.country
                  });
                }}>
                  Annuler
                </Button>
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;