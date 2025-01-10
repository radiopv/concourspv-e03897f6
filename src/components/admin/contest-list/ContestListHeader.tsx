import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateContestForm from "./CreateContestForm";

interface ContestListHeaderProps {
  onContestSelect: (id: string) => void;
}

const ContestListHeader: React.FC<ContestListHeaderProps> = ({ onContestSelect }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des concours
          </h1>
          <p className="text-gray-500 text-lg">
            Créez et organisez vos concours en quelques clics
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau concours
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau concours</DialogTitle>
            </DialogHeader>
            <CreateContestForm 
              onContestCreated={(id) => {
                onContestSelect(id);
                setIsOpen(false);
              }}
              onCancel={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContestListHeader;