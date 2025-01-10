import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Trophy, Calendar, Users } from 'lucide-react';

const ContestsList = () => {
  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['all-contests'],
    queryFn: async () => {
      console.log('Fetching all contests...');
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          participants(count),
          questions(count)
        `);

      if (error) {
        console.error('Error fetching contests:', error);
        throw error;
      }

      console.log('Raw contests data:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Liste des concours</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Une erreur est survenue lors du chargement des concours.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Liste des concours</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contests && contests.length > 0 ? (
          contests.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl">{contest.title}</CardTitle>
                  <Badge 
                    variant={contest.status === 'active' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {contest.status}
                  </Badge>
                </div>
                {contest.is_new && (
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    Nouveau
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {contest.description || 'Aucune description disponible'}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Du {format(new Date(contest.start_date), 'dd MMMM yyyy', { locale: fr })} au{' '}
                      {format(new Date(contest.end_date), 'dd MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>
                      {contest.participants?.[0]?.count || 0} participant(s)
                    </span>
                  </div>

                  {contest.has_big_prizes && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Trophy className="w-4 h-4" />
                      <span>Gros lots à gagner</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            Aucun concours n'est disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestsList;