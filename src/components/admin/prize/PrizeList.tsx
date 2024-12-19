import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PrizeCard } from "./PrizeCard";
import { Collapsible } from "@/components/ui/collapsible";

interface PrizeListProps {
  contestId: string;
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  editForm: any;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  uploading: boolean;
}

export const PrizeList = ({
  contestId,
  onEdit,
  onDelete,
  editForm,
  onFormChange,
  onImageUpload,
  onCancelEdit,
  onSaveEdit,
  uploading,
}: PrizeListProps) => {
  const { data: contestPrizes, isLoading } = useQuery({
    queryKey: ['prizes', contestId],
    queryFn: async () => {
      console.log('Fetching contest prizes...');
      const { data, error } = await supabase
        .from('prizes')
        .select(`
          *,
          catalog_item:prize_catalog(*)
        `)
        .eq('contest_id', contestId);
      
      if (error) {
        console.error('Error fetching contest prizes:', error);
        throw error;
      }
      console.log('Contest prizes data:', data);
      return data;
    }
  });

  if (isLoading) return <div>Chargement des prix...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contestPrizes?.map((prize) => (
        <Collapsible key={prize.id}>
          <PrizeCard
            prize={prize}
            editForm={editForm}
            onEdit={onEdit}
            onDelete={onDelete}
            onFormChange={onFormChange}
            onImageUpload={onImageUpload}
            onCancelEdit={onCancelEdit}
            onSaveEdit={onSaveEdit}
            uploading={uploading}
          />
        </Collapsible>
      ))}
    </div>
  );
};
