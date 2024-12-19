import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { supabase } from "../../../App";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface DrawHistoryProps {
  contestId: string;
}

const DrawHistory = ({ contestId }: DrawHistoryProps) => {
  const { data: drawHistory } = useQuery({
    queryKey: ['draw-history', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('draw_history')
        .select(`
          *,
          participants (
            first_name,
            last_name,
            email
          )
        `)
        .eq('contest_id', contestId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des tirages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {drawHistory?.length === 0 ? (
          <p className="text-gray-500">Aucun tirage effectué</p>
        ) : (
          <div className="space-y-4">
            {drawHistory?.map((draw) => (
              <div key={draw.id} className="border-b pb-4">
                <p className="font-medium">
                  Tirage du {format(new Date(draw.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
                <p className="text-sm text-gray-600">
                  Gagnant : {draw.participants.first_name} {draw.participants.last_name}
                </p>
                <p className="text-sm text-gray-600">
                  Email : {draw.participants.email}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DrawHistory;
