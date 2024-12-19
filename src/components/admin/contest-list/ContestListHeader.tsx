import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { Link } from "react-router-dom";

const ContestListHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold tracking-tight">Concours</h2>
      <div className="flex gap-4">
        <Link to="/admin/question-bank">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Banque de Questions
          </Button>
        </Link>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Concours
        </Button>
      </div>
    </div>
  );
};

export default ContestListHeader;