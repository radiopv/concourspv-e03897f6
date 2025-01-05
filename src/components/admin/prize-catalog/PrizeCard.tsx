import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Link } from "lucide-react";

interface PrizeCardProps {
  prize: {
    id: string;
    name: string;
    description?: string;
    value?: number;
    image_url?: string;
    shop_url?: string;
  };
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
}

export const PrizeCard = ({ prize, onEdit, onDelete }: PrizeCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
                <Trash2 className="h-4 w-4" />
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
            {prize.value ? `${prize.value} $ CAD` : 'Prix non défini'}
          </span>
          {prize.shop_url && (
            <a
              href={prize.shop_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              <Link className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};