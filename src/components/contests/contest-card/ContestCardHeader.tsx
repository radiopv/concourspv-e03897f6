import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Archive, Eye } from "lucide-react";

interface ContestCardHeaderProps {
  title: string;
  contestId: string;
  status: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ContestCardHeader = ({
  title,
  contestId,
  status,
  onSelect,
  onEdit,
  onArchive,
  onDelete,
}: ContestCardHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <CardTitle className="text-xl font-bold">{title}</CardTitle>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSelect(contestId)}
          title="Voir le concours"
        >
          <Eye className="h-4 w-4" />
        </Button>
        {status !== 'archived' && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(contestId)}
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(contestId)}
              title="Archiver"
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(contestId)}
              title="Supprimer"
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContestCardHeader;