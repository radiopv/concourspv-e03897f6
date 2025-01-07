import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AdminContestManager from "../AdminContestManager";
import { useIsMobile } from "@/hooks/use-mobile";

const ContestListHeader = () => {
  const [isNewContestOpen, setIsNewContestOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} mb-8`}>
        <h2 className="text-3xl font-bold tracking-tight">Concours</h2>
        <div className={`flex ${isMobile ? 'flex-col' : ''} gap-4`}>
          <Link to="/admin/question-bank" className={isMobile ? 'w-full' : ''}>
            <Button 
              variant="outline" 
              className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}
            >
              <Database className="w-4 h-4" />
              Banque de Questions
            </Button>
          </Link>
          <Button 
            className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}
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