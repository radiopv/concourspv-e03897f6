import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../App";
import ContestStats from "./ContestStats";
import UserProgress from "./contest-card/UserProgress";
import ContestPrizes from "./contest-card/ContestPrizes";
import ParticipationStats from "./contest-card/ParticipationStats";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    is_new: boolean;
    has_big_prizes: boolean;
    participants?: { count: number };
  };
  onSelect: (id: string) => void;
  index: number;
}

const ContestCard = ({ contest, onSelect, index }: ContestCardProps) => {
  const [showParticipants, setShowParticipants] = useState(false);

  const { data: prizes } = useQuery({
    queryKey: ['contest-prizes', contest.id],
    queryFn: async () => {
      const { data: prizesData } = await supabase
        .from('prizes')
        .select(`
          catalog_item_id,
          prize_catalog (
            name,
            image_url,
            shop_url
          )
        `)
        .eq('contest_id', contest.id);
      return prizesData || [];
    },
  });

  const { data: participants } = useQuery({
    queryKey: ['contest-participants', contest.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: showParticipants
  });

  const { data: settings } = useQuery({
    queryKey: ['global-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: userParticipation } = useQuery({
    queryKey: ['user-participation', contest.id],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return null;

      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('contest_id', contest.id)
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  const remainingAttempts = settings?.default_attempts 
    ? settings.default_attempts - (userParticipation?.attempts || 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow glass-card float">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
            {contest.is_new && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                Nouveau
              </Badge>
            )}
          </div>
          {contest.has_big_prizes && (
            <Badge variant="secondary" className="bg-amber-500 text-white flex items-center gap-1 w-fit">
              <Trophy className="w-4 h-4" />
              Gros lots à gagner
            </Badge>
          )}
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {contest.description && (
            <p className="text-gray-600 mb-6">
              {contest.description}
            </p>
          )}
          
          <ContestStats contestId={contest.id} />

          <UserProgress
            userParticipation={userParticipation}
            settings={settings}
            remainingAttempts={remainingAttempts}
          />
          
          <ContestPrizes prizes={prizes || []} />

          <div className="mt-4 space-y-4">
            <ParticipationStats
              participantsCount={contest.participants?.count || 0}
            />

            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowParticipants(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Voir les participants
            </Button>

            <Button 
              onClick={() => onSelect(contest.id)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3"
              disabled={remainingAttempts <= 0}
            >
              {remainingAttempts > 0 ? 'Participer' : 'Plus de tentatives disponibles'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Participants au concours</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de participation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants?.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.first_name}</TableCell>
                    <TableCell>{participant.last_name}</TableCell>
                    <TableCell>{participant.score}%</TableCell>
                    <TableCell>
                      <Badge variant={participant.status === 'WINNER' ? "success" : "secondary"}>
                        {participant.status === 'WINNER' ? 'Gagnant' : 'Participant'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {participant.completed_at 
                        ? new Date(participant.completed_at).toLocaleDateString('fr-FR')
                        : "N/A"
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ContestCard;