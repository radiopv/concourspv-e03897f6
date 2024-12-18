import React from 'react';
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Edit, Trash2 } from "lucide-react";
import { PrizeEditForm } from "./prize/PrizeEditForm";

interface ContestCardProps {
  contest: any;
  onEdit: (contest: any) => void;
  onDelete: (id: string) => void;
  editForm: any;
  onFormChange: (field: string, value: string) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  uploading: boolean;
}

const ContestCard = ({
  contest,
  onEdit,
  onDelete,
  editForm,
  onFormChange,
  onImageUpload,
  onCancelEdit,
  onSaveEdit,
  uploading,
}: ContestCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        {contest.image_url && (
          <div className="aspect-square relative mb-4">
            <img
              src={contest.image_url}
              alt={contest.name}
              className="object-cover rounded-lg w-full h-full"
            />
            <div className="absolute top-2 right-2 space-x-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onEdit(contest)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(contest.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <h3 className="font-semibold mb-2">{contest.name}</h3>
        {contest.description && (
          <p className="text-sm text-gray-500">{contest.description}</p>
        )}
      </CardContent>
      <CollapsibleContent>
        <CardContent className="pt-0">
          <PrizeEditForm
            editForm={editForm}
            onFormChange={onFormChange}
            onImageUpload={onImageUpload}
            onCancel={onCancelEdit}
            onSave={onSaveEdit}
            uploading={uploading}
          />
        </CardContent>
      </CollapsibleContent>
    </Card>
  );
};

export default ContestCard;
