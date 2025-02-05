import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuestionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const QuestionFilter = ({ value, onChange }: QuestionFilterProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="available">Disponible</SelectItem>
          <SelectItem value="in_use">En utilisation</SelectItem>
          <SelectItem value="archived">Archivé</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default QuestionFilter;