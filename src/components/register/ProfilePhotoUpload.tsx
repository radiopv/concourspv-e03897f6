import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { supabase } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const ProfilePhotoUpload = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Check if user is authenticated
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour télécharger une photo.",
        });
        return;
      }

      // Convert file to webp if it's an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      const fileExt = 'webp';
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);

      // Update the member's avatar_url
      const { error: updateError } = await supabase
        .from('members')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }
      
      toast({
        title: "Photo de profil mise à jour",
        description: "Votre photo de profil a été téléchargée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger la photo. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatarUrl || ""} />
        <AvatarFallback>
          <Camera className="w-8 h-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex items-center">
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("avatar")?.click()}
        >
          <Camera className="w-4 h-4 mr-2" />
          Ajouter une photo
        </Button>
      </div>
    </div>
  );
};