import { Database } from "@/integrations/supabase/types";

type Winner = Database['public']['Tables']['featured_winners']['Row'];

interface WinnersListProps {
  winners: Winner[];
}

const WinnersList = ({ winners }: WinnersListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {winners.map((winner) => (
        <div
          key={winner.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={winner.photo_url || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'}
              alt={`${winner.first_name} ${winner.last_name}`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              {winner.first_name} {winner.last_name}
            </h3>
            {winner.description && (
              <p className="text-gray-600 mt-2">{winner.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WinnersList;