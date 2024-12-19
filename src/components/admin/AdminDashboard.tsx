import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, ListPlus } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select(`
          *,
          questions:questions(count),
          participants:participants(count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de bord de l'administrateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {contests?.map((contest) => (
              <Card key={contest.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{contest.title}</h3>
                    <p className="text-sm text-gray-500">
                      Questions: {contest.questions?.count || 0} | 
                      Participants: {contest.participants?.count || 0}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/contests/${contest.id}/questions`)}
                    >
                      <ListPlus className="h-4 w-4 mr-2" />
                      Questions
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/contests/${contest.id}`)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Gérer
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;