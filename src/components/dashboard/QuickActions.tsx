import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow" 
        onClick={() => navigate("/contests")}
      >
        <CardHeader>
          <CardTitle className="text-xl">Voir les concours</CardTitle>
          <CardDescription>Participez aux concours actifs</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default QuickActions;