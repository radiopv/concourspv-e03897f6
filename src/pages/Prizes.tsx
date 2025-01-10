import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trophy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrizesPage = () => {
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-amber-500" />
          Cadeaux à Gagner
        </h1>
        <p className="text-gray-600">
          Découvrez les superbes cadeaux que vous pouvez gagner en participant à nos concours !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prizes?.map((prize) => (
          <Card key={prize.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              {prize.image_url && (
                <div className="aspect-video relative">
                  <img
                    src={prize.image_url}
                    alt={prize.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{prize.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{prize.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-purple-600">
                  {prize.value ? `${prize.value} $` : 'Prix non défini'}
                </span>
                {prize.shop_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={prize.shop_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Voir le produit
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrizesPage;