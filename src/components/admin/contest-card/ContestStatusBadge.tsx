import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContestStatusBadgeProps {
  status: string;
}

const ContestStatusBadge = ({ status }: ContestStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Brouillon',
          variant: 'secondary' as const,
          className: 'bg-gray-200 text-gray-700'
        };
      case 'active':
        return {
          label: 'Actif',
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600'
        };
      case 'archived':
        return {
          label: 'Archivé',
          variant: 'destructive' as const
        };
      default:
        return {
          label: status,
          variant: 'default' as const
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className)}
    >
      {config.label}
    </Badge>
  );
};

export default ContestStatusBadge;