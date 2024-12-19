import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfilePhotoUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      if (data) {
        const { data: urlData } = await supabase.storage
          .from('avatars')
          .getPublicUrl(data.path);

        if (urlData) {
          toast({
            title: "Success",
            description: "Photo uploaded successfully",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={uploadPhoto}
        disabled={uploading}
      />
    </div>
  );
};

export default ProfilePhotoUpload;