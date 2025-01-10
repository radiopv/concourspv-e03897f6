import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import ContestList from './ContestList';

interface AdminContestManagerProps {
  onContestSelect?: (id: string) => void;
}

const AdminContestManager: React.FC<AdminContestManagerProps> = ({ onContestSelect }) => {
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*');

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading contests: {error.message}</div>;

  return (
    <div>
      <h1>Admin Contest Manager</h1>
      <ContestList 
        contests={data} 
        onSelectContest={onContestSelect}
      />
    </div>
  );
};

export default AdminContestManager;