import { useQuery } from "@tanstack/react-query";
import { supabase } from "../App";
import ParticipantsList from "@/components/admin/ParticipantsList";

const AdminParticipants = () => {
  const { data: contests, isLoading } = useQuery({
    queryKey: ['admin-contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des participants</h1>
      {contests?.map((contest) => (
        <div key={contest.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{contest.title}</h2>
          <ParticipantsList contestId={contest.id} />
        </div>
      ))}
    </div>
  );
};

export default AdminParticipants;