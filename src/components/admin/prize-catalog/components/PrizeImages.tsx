import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PrizeImagesProps {
  images: string[];
  mainImage?: string;
  onImagesChange: (images: string[]) => void;
  onMainImageChange: (url: string) => void;
}

export const PrizeImages = ({ 
  images, 
  mainImage, 
  onImagesChange, 
  onMainImageChange 
}: PrizeImagesProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prizes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('prizes')
        .getPublicUrl(filePath);

      const newImages = [...images, publicUrl];
      onImagesChange(newImages);
      
      if (!mainImage) {
        onMainImageChange(publicUrl);
      }

      toast({
        title: "Succès",
        description: "L'image a été téléchargée",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    if (images[index] === mainImage) {
      onMainImageChange(newImages[0] || '');
    }
  };

  const setAsMain = (url: string) => {
    onMainImageChange(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Images du prix</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className={`w-full aspect-square object-cover rounded-lg ${
                url === mainImage ? 'ring-2 ring-primary' : ''
              }`}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setAsMain(url)}
                disabled={url === mainImage}
              >
                Définir comme principale
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};