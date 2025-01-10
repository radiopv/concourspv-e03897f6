import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ContestCardProps {
  contest: {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    status?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContestCard = ({ contest, onEdit, onDelete }: ContestCardProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contest.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{contest.description}</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(contest.id)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/contests/${contest.id}/questions`)}
          >
            <List className="w-4 h-4 mr-2" />
            Questions
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(contest.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestCard;