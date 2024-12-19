import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrizeCatalogDialog } from "../prize/PrizeCatalogDialog";
import PrizeList from "../prize/PrizeList";
import { useToast } from "@/hooks/use-toast";

const PrizeCatalogManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: prizes, isLoading } = useQuery({
    queryKey: ['prize-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_catalog')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Prize Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsDialogOpen(true)}>Add Prize</Button>
          <PrizeList prizes={prizes} />
        </CardContent>
      </Card>

      <PrizeCatalogDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default PrizeCatalogManager;

