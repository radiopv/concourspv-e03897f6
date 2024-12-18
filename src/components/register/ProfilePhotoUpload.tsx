import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const ProfilePhotoUpload = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    setUploading(true);
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `profile_photos/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('profile_photos')
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile_photos')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Succès",
        description: "L'image a été téléchargée avec succès.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Téléchargement..." : "Télécharger"}
      </button>
      {imageUrl && (
        <div>
          <h3>Aperçu de l'image :</h3>
          <img src={imageUrl} alt="Aperçu" className="w-32 h-32 object-cover rounded" />
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;
