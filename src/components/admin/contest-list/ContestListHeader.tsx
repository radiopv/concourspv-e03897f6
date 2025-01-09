import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateTestContest from "../test/CreateTestContest";

interface ContestListHeaderProps {
  onContestSelect: (id: string) => void;
}

const ContestListHeader: React.FC<ContestListHeaderProps> = ({ onContestSelect }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">Gestion des concours</h2>
        <p className="text-muted-foreground">
          Créez et gérez vos concours
        </p>
      </div>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau concours
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau concours</DialogTitle>
          </DialogHeader>
          <CreateTestContest onContestCreated={(id) => onContestSelect(id)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContestListHeader;