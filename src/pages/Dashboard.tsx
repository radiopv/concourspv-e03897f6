import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const { toast } = useToast();

  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des concours.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return <div>Chargement des concours...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tableau de bord</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contests.map((contest) => (
              <TableRow key={contest.id}>
                <TableCell>{contest.title}</TableCell>
                <TableCell>{new Date(contest.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{contest.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
