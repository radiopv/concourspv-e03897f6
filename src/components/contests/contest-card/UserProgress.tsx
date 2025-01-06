import { AlertCircle, Star, Gift, Share2, Camera, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculatePointsAndAttempts, calculateSocialPoints } from "../../../utils/pointsCalculator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../App";

interface UserProgressProps {
  userParticipation: any;
  settings: any;
  remainingAttempts: number;
}

const UserProgress = ({ userParticipation, settings, remainingAttempts }: UserProgressProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  
  if (!userParticipation) return null;

  const correctAnswers = userParticipation.score || 0;
  const { points, bonusAttempts, nextMilestone } = calculatePointsAndAttempts(correctAnswers);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      // Partage sur les réseaux sociaux
      const shareData = {
        title: 'Mon score au concours',
        text: `J'ai obtenu ${points} points ! Participez vous aussi !`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        
        // Ajouter les points de partage
        const socialPoints = calculateSocialPoints('share');
        await supabase
          .from('participants')
          .update({ 
            points: points + socialPoints,
            bonus_attempts: bonusAttempts + 1
          })
          .eq('id', userParticipation.id);

        toast({
          title: "Partage réussi !",
          description: `Vous avez gagné ${socialPoints} points et 1 participation bonus !`,
        });
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de partager pour le moment",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const progressToNextMilestone = ((points % 25) / 25) * 100;

  return (
    <div className="mb-6 space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
        <AlertCircle className="w-5 h-5 text-blue-500" />
        Votre progression
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600">Score requis</p>
          <p className="text-lg font-bold text-blue-600">
            {settings?.required_percentage || 70}%
          </p>
        </div>
        
        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600">Tentatives restantes</p>
          <p className={`text-lg font-bold ${remainingAttempts > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {remainingAttempts + bonusAttempts}
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            Points gagnés
          </p>
          <p className="text-lg font-bold text-yellow-600">{points}</p>
        </div>

        <div className="bg-white p-3 rounded-lg">
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <Gift className="w-4 h-4 text-purple-500" />
            Prochain bonus
          </p>
          <p className="text-lg font-bold text-purple-600">
            {nextMilestone.points} pts = +{nextMilestone.attemptsToUnlock} participations
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">Progression vers le prochain palier</p>
        <Progress value={progressToNextMilestone} className="h-2" />
      </div>

      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-3">Gagnez des points bonus :</p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Partager (+5 pts)
          </Button>
          
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Photo (+10 pts)
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4 mr-2" />
            Témoignage (+15 pts)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProgress;