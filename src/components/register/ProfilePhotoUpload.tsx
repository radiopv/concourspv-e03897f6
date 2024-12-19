import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const ProfilePhotoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `profile_photos/${fileName}`;

    try {
      const { error } = await supabase.storage.from('profile-photos').upload(filePath, file);
      if (error) throw error;

      const { publicURL, error: urlError } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
      if (urlError) throw urlError;

      // Here you can save the public URL to the user's profile in your database
      console.log("File uploaded successfully:", publicURL);
      toast({
        title: "Succès",
        description: "Votre photo de profil a été téléchargée avec succès.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de la photo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="profile-photo">Télécharger une photo de profil</Label>
      <Input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button onClick={handleUpload} disabled={!file}>
        Télécharger
      </Button>
    </div>
  );
};

export default ProfilePhotoUpload;
