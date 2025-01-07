import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Link } from "lucide-react";
import { Prize } from "@/types/prize";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PrizeForm } from "../PrizeForm";
import { PrizeActions } from "./PrizeActions";
import { PrizeImage } from "./PrizeImage";

interface PrizeCardProps {
  prize: Prize;
  onEdit: (prize: Prize) => void;
  onDelete: (id: string) => void;
}

export const PrizeCard = ({ prize, onEdit, onDelete }: PrizeCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${prize.is_archived ? 'opacity-60' : ''}`}>
      <CardContent className="pt-6">
        <PrizeImage imageUrl={prize.main_image_url} altText={prize.name}>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Modifier le prix</DialogTitle>
              </DialogHeader>
              <PrizeForm 
                formData={{
                  name: prize.name,
                  description: prize.description || "",
                  value: prize.value?.toString() || "",
                  image_url: prize.main_image_url || "",
                  shop_url: prize.shop_url || "",
                }}
                onFormChange={(field, value) => {
                  const updatedPrize = { ...prize, [field]: value };
                  onEdit(updatedPrize);
                }}
                onImageUpload={async (event) => {
                  // L'upload d'image est géré dans le PrizeForm
                }}
                onCancelEdit={() => {
                  const closeButton = document.querySelector('[data-dialog-close]');
                  if (closeButton instanceof HTMLElement) {
                    closeButton.click();
                  }
                }}
                onSaveEdit={() => {
                  const closeButton = document.querySelector('[data-dialog-close]');
                  if (closeButton instanceof HTMLElement) {
                    closeButton.click();
                  }
                }}
                uploading={false}
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(prize.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </PrizeImage>
        
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