import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Trophy, Image } from "lucide-react";
import { supabase } from "../../../App";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WinnerManagerProps {
  contestId: string;
  winner: {
    id: string;
    first_name: string;
    last_name: string;
    facebook_profile_url?: string;
    profile_image_url?: string;
  };
  onWinnerDeleted: () => void;
}

const WinnerManager = ({ contestId, winner, onWinnerDeleted }: WinnerManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [winnerData, setWinnerData] = useState({
    facebook_profile_url: winner.facebook_profile_url || '',
    profile_image_url: winner.profile_image_url || ''
  });

  const handleDeleteWinner = async () => {
    try {
      // Reset winner status to completed
      const { error: updateError } = await supabase
        .from('participants')
        .update({ status: 'completed' })
        .eq('id', winner.id);

      if (updateError) throw updateError;

      // Delete from draw history
      const { error: deleteError } = await supabase
        .from('draw_history')
        .delete()
        .eq('participant_id', winner.id);

      if (deleteError) throw deleteError;

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });

      toast({
        title: "Succès",
        description: "Le gagnant a été supprimé",
      });

      onWinnerDeleted();
    } catch (error) {
      console.error('Error deleting winner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le gagnant",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWinner = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('participants')
        .update({
          facebook_profile_url: winnerData.facebook_profile_url,
          profile_image_url: winnerData.profile_image_url
        })
        .eq('id', winner.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['contests'] });
      await queryClient.invalidateQueries({ queryKey: ['contest-winners', contestId] });

      toast({
        title: "Succès",
        description: "Les informations du gagnant ont été mises à jour",
      });
    } catch (error) {
      console.error('Error updating winner:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations du gagnant",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          {winner.first_name} {winner.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="facebook_url">Profil Facebook</Label>
          <Input
            id="facebook_url"
            value={winnerData.facebook_profile_url}
            onChange={(e) => setWinnerData(prev => ({ ...prev, facebook_profile_url: e.target.value }))}
            placeholder="URL du profil Facebook"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile_image">Photo de profil</Label>
          <Input
            id="profile_image"
            value={winnerData.profile_image_url}
            onChange={(e) => setWinnerData(prev => ({ ...prev, profile_image_url: e.target.value }))}
            placeholder="URL de la photo de profil"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleUpdateWinner} 
            disabled={isUpdating}
            className="flex-1"
          >
            <Image className="w-4 h-4 mr-2" />
            Mettre à jour
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera le gagnant actuel et permettra un nouveau tirage.
                  Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteWinner}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default WinnerManager;