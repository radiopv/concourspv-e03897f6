import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface Prize {
  prize_catalog: {
    id: string;
    name: string;
    image_url?: string;
    shop_url?: string;
    value?: number;
    description?: string;
  };
}

interface ContestPrizesProps {
  prizes?: Prize[];
  isLoading?: boolean;
}

const ContestPrizes = ({ prizes, isLoading }: ContestPrizesProps) => {
  const { toast } = useToast();
  
  const { data: publicPrizes, isLoading: isPrizesLoading, error } = useQuery({
    queryKey: ['public-prizes'],
    queryFn: async () => {
      console.log('Starting to fetch public prizes from catalog...');
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Session exists' : 'No session', sessionError);
      
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching public prizes:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les prix. Veuillez réessayer.",
        });
        throw error;
      }

      if (!data) {
        console.log('No prizes found in catalog');
        return [];
      }

      console.log('Successfully fetched public prizes:', data);
      return data;
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  if (error) {
    console.error('Prize query error:', error);
  }

  if (isLoading || isPrizesLoading) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle>Prix à gagner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!publicPrizes || publicPrizes.length === 0) {
    return (
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
          <CardTitle>Prix à gagner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">
            Aucun prix n'est disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <Trophy className="w-8 h-8 mx-auto text-indigo-600 mb-2" />
        <CardTitle>Prix à gagner</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicPrizes.map((prize) => (
            <div
              key={prize.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {prize.image_url && (
                <div className="aspect-video relative">
                  <img
                    src={prize.image_url}
                    alt={prize.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-purple-700">
                  {prize.name}
                </h3>
                {prize.description && (
                  <p className="text-sm text-gray-600">
                    {prize.description}
                  </p>
                )}
                {prize.value && (
                  <p className="text-sm font-medium text-purple-600">
                    Valeur: {prize.value}€
                  </p>
                )}
                {prize.shop_url && (
                  <a
                    href={prize.shop_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors mt-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Voir le cadeau
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
