import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/lib/supabase";
import ContestList from './ContestList';
import EditContestForm from './EditContestForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AdminContestManager = () => {
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
    <div className="space-y-6">
      <h1>Admin Contest Manager</h1>
      
      {selectedContestId && (
        <Accordion type="single" collapsible className="w-full mb-6" defaultValue="edit-contest">
          <AccordionItem value="edit-contest">
            <AccordionTrigger>
              Modifier le concours
            </AccordionTrigger>
            <AccordionContent>
              <EditContestForm 
                contestId={selectedContestId} 
                onClose={() => setSelectedContestId(null)}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <ContestList 
        contests={data} 
        onSelectContest={(id) => setSelectedContestId(id)}
      />
    </div>
  );
};

export default AdminContestManager;