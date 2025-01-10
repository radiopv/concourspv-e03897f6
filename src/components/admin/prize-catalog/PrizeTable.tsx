import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

interface PrizeTableProps {
  prizes: any[];
  onEdit: (prize: any) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, status: 'active' | 'archived') => void;
  onVisibilityToggle: (id: string, isVisible: boolean) => void;
}

const PrizeTable = ({
  prizes,
  onEdit,
  onDelete,
  onArchive,
  onVisibilityToggle
}: PrizeTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Valeur</TableHead>
          <TableHead>Visibilité</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prizes.map((prize) => (
          <TableRow key={prize.id}>
            <TableCell>
              {prize.image_url && (
                <img
                  src={prize.image_url}
                  alt={prize.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
            </TableCell>
            <TableCell>{prize.name}</TableCell>
            <TableCell className="max-w-xs truncate">{prize.description}</TableCell>
            <TableCell>{prize.value}€</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onVisibilityToggle(prize.id, !prize.is_visible)}
              >
                {prize.is_visible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
            <TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PrizeTable;