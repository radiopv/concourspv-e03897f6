import React from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface CreateTestContestProps {
  onContestCreated: (id: string) => void;
}

const CreateTestContest: React.FC<CreateTestContestProps> = ({ onContestCreated }) => {
  const handleCreateContest = async () => {
    try {
      const { data, error } = await supabase
        .from('contests')
        .insert([
          {
            title: 'Test Contest',
            description: 'This is a test contest',
            status: 'draft',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            draw_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (data) onContestCreated(data.id);
    } catch (error) {
      console.error('Error creating test contest:', error);
    }
  };

  return (
    <Button onClick={handleCreateContest} className="w-full">
      Créer un concours test
    </Button>
  );
};

export default CreateTestContest;