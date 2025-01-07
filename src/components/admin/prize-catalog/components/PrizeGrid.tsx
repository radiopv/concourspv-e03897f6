import { Card, CardContent } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Prize } from "@/types/prize";
import { PrizeActions } from "./PrizeActions";
import { PrizeImage } from "./PrizeImage";

interface PrizeGridProps {
  prizes: Prize[];
  onEdit: (prize: Prize) => void;
  onDelete: (id: string) => void;
}

export const PrizeGrid = ({ prizes, onEdit, onDelete }: PrizeGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prizes.map((prize) => (
        <Card key={prize.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <PrizeImage imageUrl={prize.main_image_url} altText={prize.name}>
              <PrizeActions
                onEdit={() => onEdit(prize)}
                onDelete={() => onDelete(prize.id)}
              />
            </PrizeImage>
            
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
      ))}
    </div>
  );
};