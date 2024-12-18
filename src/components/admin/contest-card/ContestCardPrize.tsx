import React, { useState } from 'react';
import { ExternalLink, Image, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";

interface ContestCardPrizeProps {
  prizeImageUrl?: string;
  shopUrl?: string;
  contestId: string;
}

const ContestCardPrize = ({ prizeImageUrl, shopUrl, contestId }: ContestCardPrizeProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      const { error: updateError } = await supabase
        .from('contests')
        .update({ prize_image_url: publicUrl })
        .eq('id', contestId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] });
      
      toast({
        title: "Succès",
        description: "L'image du prix a été mise à jour",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {prizeImageUrl ? (
        <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
          <img
            src={prizeImageUrl}
            alt="Prix à gagner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id={`prize-image-${contestId}`}
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Button 
              variant="ghost" 
              className="text-white"
              onClick={() => document.getElementById(`prize-image-${contestId}`)?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Chargement...' : 'Modifier l\'image'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id={`prize-image-${contestId}`}
            onChange={handleImageUpload}
            disabled={uploading}
          />
          <Button 
            variant="outline" 
            className="w-full h-32" 
            onClick={() => document.getElementById(`prize-image-${contestId}`)?.click()}
            disabled={uploading}
          >
            <Image className="w-4 h-4 mr-2" />
            {uploading ? 'Chargement...' : 'Ajouter une image du prix'}
          </Button>
        </div>
      )}
      
      {shopUrl && (
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ExternalLink className="w-4 h-4" />
          Voir le prix sur la boutique
        </a>
      )}
    </div>
  );
};

export default ContestCardPrize;