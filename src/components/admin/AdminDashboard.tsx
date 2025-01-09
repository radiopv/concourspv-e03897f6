import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestList from "./ContestList";
import ParticipantsList from "./ParticipantsList";

const AdminDashboard = () => {
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <ContestList contests={contests} />
      <ParticipantsList />
    </div>
  );
};

export default AdminDashboard;
