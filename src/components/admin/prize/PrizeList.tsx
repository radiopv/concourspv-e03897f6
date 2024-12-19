import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PrizeList = ({ contestId }: { contestId: string }) => {
  const { toast } = useToast();

  const { data: prizes, isLoading, error } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prizes')
        .select('*, catalog_item:prize_catalog(*)')
        .eq('contest_id', contestId);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load prizes.",
      variant: "destructive",
    });
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prizes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prizes?.map((prize) => (
            <div key={prize.id} className="flex justify-between items-center">
              <span>{prize.catalog_item?.name}</span>
              <Button
                variant="outline"
                onClick={() => {
                  // Handle prize removal
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrizeList;
