import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";

interface ProfileCardProps {
  userProfile: {
    email: string;
    first_name: string;
    last_name: string;
  };
  isEditing: boolean;
  formData: {
    first_name: string;
    last_name: string;
    email: string;
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

  const handleSaveProfile = async () => {
    try {
      console.log("Début de la mise à jour du profil...");
      console.log("Email actuel:", userProfile.email);
      console.log("Nouvel email:", formData.email);

      // Mise à jour de l'email dans auth
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        email: formData.email,
      });

      console.log("Réponse de updateUser:", { authData, authError });

      if (authError) {
        console.error("Erreur lors de la mise à jour de l'email:", authError);
        throw authError;
      }

      // Mise à jour du profil dans la base de données
      const { data: dbData, error: dbError } = await supabase
        .from("members")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        })
        .eq("id", userId)
        .select();

      console.log("Réponse de la mise à jour DB:", { dbData, dbError });

      if (dbError) {
        console.error("Erreur lors de la mise à jour du profil:", dbError);
        throw dbError;
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès. Si vous avez modifié votre email, veuillez vérifier votre boîte de réception pour confirmer le changement.",
      });
      
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("Erreur complète:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
      });
    }
  };

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
          <div className="flex justify-end gap-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
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