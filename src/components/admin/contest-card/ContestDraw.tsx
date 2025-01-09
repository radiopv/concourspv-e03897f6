import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DrawScheduler from "../draw/DrawScheduler";
import DrawHistory from "../draw/DrawHistory";
import { drawService } from "../draw/drawService";

interface ContestDrawProps {
  contestId: string;
  drawDate?: string;
  onDrawComplete?: () => void;
}

const ContestDraw: React.FC<ContestDrawProps> = ({
  contestId,
  drawDate,
  onDrawComplete
}) => {
  const { toast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    try {
      const winner = await drawService.performDraw(contestId);
      toast({
        title: "Tirage effectué",
        description: "Le gagnant a été sélectionné avec succès",
      });
      if (onDrawComplete) onDrawComplete();
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors du tirage",
        variant: "destructive",
      });
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Tirage au sort
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DrawScheduler
          contestId={contestId}
          currentDrawDate={drawDate}
          onSchedule={() => {}}
        />
        <Button 
          onClick={handleDraw}
          disabled={isDrawing}
          className="w-full"
        >
          {isDrawing ? (
            "Tirage en cours..."
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Effectuer le tirage
            </>
          )}
        </Button>
        <DrawHistory contestId={contestId} />
      </CardContent>
    </Card>
  );
};

export default ContestDraw;