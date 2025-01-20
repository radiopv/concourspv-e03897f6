import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

const ExtraParticipations = () => {
  const { user } = useAuth();

  const { data: userPoints, isLoading } = useQuery({
    queryKey: ['user-points', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_points')
        .select('extra_participations')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participations Bonus</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16" />
        ) : (
          <div className="text-center p-6">
            <p className="text-4xl font-bold text-indigo-600 mb-2">
              {userPoints?.extra_participations || 0}
            </p>
            <p className="text-gray-600">
              participations bonus disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtraParticipations;