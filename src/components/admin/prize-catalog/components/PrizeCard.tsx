import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Archive, Eye, EyeOff, Trash2, Link } from "lucide-react";
import { Prize } from "@/types/prize";

interface PrizeCardProps {
  prize: Prize;
  onEdit: (prize: Prize) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
  onVisibility: (id: string, hidden: boolean) => void;
}

export const PrizeCard = ({ 
  prize, 
  onEdit, 
  onDelete,
  onArchive,
  onVisibility
}: PrizeCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${prize.is_archived ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6">
        {prize.main_image_url && (
          <div className="aspect-square relative mb-4">
            <img
              src={prize.main_image_url}
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
                variant="secondary"
                size="icon"
                onClick={() => onArchive(prize.id, !prize.is_archived)}
              >
                <Archive className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onVisibility(prize.id, !prize.is_hidden)}
              >
                {prize.is_hidden ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
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
        <div className="flex flex-wrap gap-2 mb-2">
          {prize.category && (
            <Badge variant="secondary">{prize.category}</Badge>
          )}
          {prize.is_archived && (
            <Badge variant="secondary">Archivé</Badge>
          )}
          {prize.is_hidden && (
            <Badge variant="secondary">Masqué</Badge>
          )}
          {prize.stock !== undefined && (
            <Badge variant="outline">Stock: {prize.stock}</Badge>
          )}
        </div>
        <div 
          className="text-sm text-gray-500 mb-2 prose prose-sm"
          dangerouslySetInnerHTML={{ __html: prize.description || '' }}
        />
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