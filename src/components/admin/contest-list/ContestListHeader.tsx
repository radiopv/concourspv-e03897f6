import { Button } from "@/components/ui/button";
import { Plus, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const ContestListHeader = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center justify-between'} mb-8`}>
        <h2 className="text-3xl font-bold tracking-tight">Concours</h2>
        <div className={`flex ${isMobile ? 'flex-col' : ''} gap-4`}>
          <Link to="/admin/questions" className={isMobile ? 'w-full' : ''}>
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
            onClick={() => navigate('/admin/contests/new')}
          >
            <Plus className="w-4 h-4" />
            Nouveau Concours
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestListHeader;