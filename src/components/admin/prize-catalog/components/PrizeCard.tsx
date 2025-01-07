import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Link, Package } from "lucide-react";
import { Prize } from "@/types/prize";

interface PrizeCardProps {
  prize: Prize;
  onEdit: (prize: Prize) => void;
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
        <div className="flex flex-wrap gap-2 mb-2">
          {prize.category && (
            <Badge variant="secondary">{prize.category}</Badge>
          )}
          {prize.is_active !== undefined && (
            <Badge variant={prize.is_active ? "default" : "secondary"}>
              {prize.is_active ? "Actif" : "Inactif"}
            </Badge>
          )}
          {prize.stock !== undefined && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {prize.stock}
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {prize.value ? `${prize.value} $ CAD` : 'Prix non défini'}
          </span>
          {prize.shop_url && (
            <a
              href={prize.shop_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <Link className="h-4 w-4" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};