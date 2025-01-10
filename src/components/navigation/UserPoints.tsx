import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPoints } from "@/services/pointsService";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const UserPoints = () => {
  const { user } = useAuth();

  const { data: points } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: () => getUserPoints(user?.id!),
    enabled: !!user?.id
  });

  if (!points) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link 
          to="/points"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 hover:from-amber-100 hover:to-yellow-100 transition-colors"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="font-medium">{points.total_points} pts</span>
          <span className="text-xl">{points.current_rank.badge}</span>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-semibold">Rang actuel : {points.current_rank.rank}</h4>
          <p className="text-sm text-gray-600">
            Meilleure série : {points.best_streak} bonnes réponses
          </p>
          <p className="text-sm text-gray-600">
            Participations bonus disponibles : {points.extra_participations}
          </p>
          <Link 
            to="/points/explanation" 
            className="text-sm text-amber-600 hover:text-amber-700 font-medium block mt-2"
          >
            En savoir plus sur les points →
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserPoints;