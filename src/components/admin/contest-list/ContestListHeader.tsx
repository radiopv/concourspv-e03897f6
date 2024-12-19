import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AdminContestManager from "../AdminContestManager";

const ContestListHeader = () => {
  const [isNewContestOpen, setIsNewContestOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Concours</h2>
        <div className="flex gap-4">
          <Link to="/admin/question-bank">
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Banque de Questions
            </Button>
          </Link>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsNewContestOpen(!isNewContestOpen)}
          >
            <Plus className="w-4 h-4" />
            Nouveau Concours
          </Button>
        </div>
      </div>

      {isNewContestOpen && (
        <Card className="w-full p-6">
          <AdminContestManager />
        </Card>
      )}
    </div>
  );
};

export default ContestListHeader;