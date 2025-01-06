import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, MapPin, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/App";
import { useAuth } from "@/contexts/AuthContext";

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
  };
  onUpdate: () => void;
}

export const ExtendedProfileCard = ({ userProfile, onUpdate }: ExtendedProfileProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    facebook_profile_url: userProfile.facebook_profile_url || "",
    street_address: userProfile.street_address || "",
    city: userProfile.city || "",
    postal_code: userProfile.postal_code || "",
    country: userProfile.country || "France",
    bio: userProfile.bio || "",
  });

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
        .eq('id', userProfile.id);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
      
      setIsEditing(false);
      onUpdate();
    } catch (error) {
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
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={userProfile.avatar_url} />
            <AvatarFallback className="bg-primary/10">
              {userProfile.first_name?.[0]}{userProfile.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex gap-4">
            <input
              type="file"
              id="photo"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("photo")?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Changer la photo
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>Statistiques</Label>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Points totaux: {userProfile.total_points || 0}
                </p>
                <p className="text-sm text-muted-foreground">
                  Concours gagnés: {userProfile.contests_won || 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Profil Facebook</Label>
              <div className="flex gap-2">
                <Facebook className="w-5 h-5 text-blue-600" />
                <Input
                  id="facebook"
                  value={formData.facebook_profile_url}
                  onChange={(e) => setFormData({ ...formData, facebook_profile_url: e.target.value })}
                  disabled={!isEditing}
                  placeholder="URL de votre profil Facebook"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                disabled={!isEditing}
                placeholder="Parlez-nous un peu de vous..."
                className="h-32"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Adresse
              </Label>
              <Input
                value={formData.street_address}
                onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                disabled={!isEditing}
                placeholder="Numéro et rue"
                className="mb-2"
              />
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!isEditing}
                placeholder="Ville"
                className="mb-2"
              />
              <Input
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                disabled={!isEditing}
                placeholder="Code postal"
                className="mb-2"
              />
              <Input
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={!isEditing}
                placeholder="Pays"
              />
            </div>
          </div>
        </div>

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