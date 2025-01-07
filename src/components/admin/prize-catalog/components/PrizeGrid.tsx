import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { Prize } from "@/types/prize";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { PrizeForm } from "./PrizeForm";

interface PrizeGridProps {
  prizes: Prize[];
  onEdit: (prize: Prize) => void;
  onDelete: (id: string) => void;
}

export const PrizeGrid = ({ prizes, onEdit, onDelete }: PrizeGridProps) => {
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prizes.map((prize) => (
          <Card key={prize.id} className="hover:shadow-lg transition-shadow">
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
                      onClick={() => setEditingPrize(prize)}
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
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingPrize} onOpenChange={(open) => !open && setEditingPrize(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le prix</DialogTitle>
          </DialogHeader>
          {editingPrize && (
            <PrizeForm
              initialData={editingPrize}
              onSubmit={(data) => {
                onEdit({ ...editingPrize, ...data });
                setEditingPrize(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};