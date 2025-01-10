import { Card, CardContent } from "@/components/ui/card";
import { Archive, Edit, Eye, EyeOff, Trash2, Undo } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PrizeGridProps {
  prizes: any[];
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, status: 'active' | 'archived') => void;
  onVisibilityToggle: (id: string, isVisible: boolean) => void;
}

const PrizeGrid = ({
  prizes,
  onEdit,
  onDelete,
  onArchive,
  onVisibilityToggle
}: PrizeGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {prizes.map((prize) => (
        <Card key={prize.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            {prize.image_url && (
              <div className="relative aspect-video">
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => onVisibilityToggle(prize.id, !prize.is_visible)}
                  >
                    {prize.is_visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold mb-2">{prize.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{prize.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {prize.value ? `${prize.value}€` : 'Prix non défini'}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(prize)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onArchive(prize.id, prize.status === 'active' ? 'archived' : 'active')}
                  >
                    {prize.status === 'active' ? (
                      <Archive className="h-4 w-4" />
                    ) : (
                      <Undo className="h-4 w-4" />
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce prix ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(prize.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PrizeGrid;