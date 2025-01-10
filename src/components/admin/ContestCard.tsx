import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 hover:bg-green-600';
      case 'draft':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'archived':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
        <Badge className={getStatusColor(contest.status)}>
          {getStatusLabel(contest.status)}
        </Badge>
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