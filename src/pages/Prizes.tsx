import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Gift, Trophy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Prizes = () => {
  const { toast } = useToast();
  
  const { data: prizes, isLoading, error } = useQuery({
    queryKey: ['prizes-catalog'],
    queryFn: async () => {
      console.log('Fetching prize catalog...');
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_active', true)
        .order('value', { ascending: false });
      
      if (error) {
        console.error('Error fetching prizes:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les prix",
        });
        throw error;
      }
      
      console.log('Prize catalog data:', data);
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-6">
              🎰 Chargement des Prix... 🎲
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-500">
              Erreur de chargement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Une erreur est survenue lors du chargement des prix. Veuillez réessayer plus tard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!prizes || prizes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-center">
              Aucun prix disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Il n'y a actuellement aucun prix dans le catalogue.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent mb-6">
            🎰 Prix Exceptionnels à Gagner! 🎲
          </h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            Participez à nos concours et tentez de remporter ces cadeaux incroyables. Plus vous participez, plus vous augmentez vos chances de gagner!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {prizes?.map((prize) => (
            <motion.div
              key={prize.id}
              whileHover={{ scale: 1.03 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden bg-white/80 backdrop-blur-sm border-amber-200/50 hover:shadow-xl transition-all">
                <CardHeader className="relative">
                  {prize.image_url && (
                    <div className="aspect-video relative rounded-t-xl overflow-hidden">
                      <img
                        src={prize.image_url}
                        alt={prize.name}
                        className="w-full h-full object-cover"
                      />
                      {prize.value && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                          <Trophy className="w-4 h-4" />
                          <span className="font-bold">${prize.value}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <CardTitle className="text-2xl font-bold text-amber-800 flex items-center gap-2 mt-4">
                    <Gift className="w-6 h-6 text-amber-500" />
                    {prize.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prize.description && (
                    <div 
                      className="text-amber-700 mb-4"
                      dangerouslySetInnerHTML={{ __html: prize.description }}
                    />
                  )}
                  {prize.shop_url && (
                    <a
                      href={prize.shop_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors mt-2"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir le cadeau sur la boutique
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prizes;