import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PrizeCatalogDialog } from "@/components/admin/prize/PrizeCatalogDialog";
import PrizeList from "@/components/admin/prize/PrizeList";

const PrizeCatalogManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handlePrizeSelect = async (prizeId: string) => {
    try {
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Prize selected successfully",
      });
    } catch (error) {
      console.error('Error selecting prize:', error);
      toast({
        title: "Error",
        description: "Failed to select prize",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prize Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsDialogOpen(true)}>Add Prize</Button>
          <PrizeList contestId={prizes?.[0]?.contest_id || ''} />
        </CardContent>
      </Card>

      <PrizeCatalogDialog onSelectPrize={handlePrizeSelect} />
    </div>
  );
};

export default PrizeCatalogManager;