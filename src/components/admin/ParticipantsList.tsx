import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ParticipantsListProps {
  contestId: string;
}

const ParticipantsList = ({ contestId }: ParticipantsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: participants, isLoading } = useQuery({
    queryKey: ['participants', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participants')
        .select(`
          id,
          first_name,
          last_name,
          email,
          created_at,
          completed_at,
          status
        `)
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: async (participantId: string) => {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', participantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', contestId] });
      toast({
        title: "Succès",
        description: "Le participant a été supprimé",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le participant",
      });
    }
  });

  if (isLoading) {
    return <div className="p-4">Chargement des participants...</div>;
  }

  const getStatusBadge = (status: string | null) => {
    if (status === 'completed') {
      return <Badge className="bg-yellow-500">Complété</Badge>;
    }
    return <Badge variant="secondary">En cours</Badge>;
  };

  return (
    <div className="space-y-6 mt-8 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Liste des participants</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {participants?.length || 0} participants
        </span>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Nom</TableHead>
                <TableHead className="font-semibold">Prénom</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Date d'inscription</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants?.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-gray-50">
                  <TableCell className="py-4">{participant.last_name}</TableCell>
                  <TableCell className="py-4">{participant.first_name}</TableCell>
                  <TableCell className="py-4">{participant.email}</TableCell>
                  <TableCell className="py-4">
                    {participant.created_at && 
                      format(new Date(participant.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </TableCell>
                  <TableCell className="py-4">
                    {getStatusBadge(participant.status)}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteParticipantMutation.mutate(participant.id)}
                      className="hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;