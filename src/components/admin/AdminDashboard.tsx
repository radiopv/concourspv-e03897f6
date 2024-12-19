import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);

  const fetchContests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching contests:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les concours.",
        variant: "destructive",
      });
    } else {
      setContests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord de l'administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Chargement des concours...</div>
          ) : (
            <ul>
              {contests.map((contest) => (
                <li key={contest.id}>
                  {contest.title} - {contest.start_date}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Button onClick={fetchContests}>Rafraîchir</Button>
    </div>
  );
};

export default AdminDashboard;
