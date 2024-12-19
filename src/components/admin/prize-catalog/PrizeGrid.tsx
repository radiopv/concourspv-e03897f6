import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Link as LinkIcon } from 'lucide-react';

interface PrizeGridProps {
  prizes: any[];
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
}

export const PrizeGrid = ({ prizes, onEdit, onDelete }: PrizeGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prizes.map((prize) => (
        <Card key={prize.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            {prize.image_url && (
              <div className="aspect-square relative mb-4">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="object-cover rounded-lg w-full h-full"
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onEdit(prize)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(prize.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <h3 className="font-semibold mb-2">{prize.name}</h3>
            {prize.description && (
              <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {prize.value ? `${prize.value}€` : 'Prix non défini'}
              </span>
              {prize.shop_url && (
                <a
                  href={prize.shop_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <LinkIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};