import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ContestStatusBadgeProps {
  status: string;
}

const ContestStatusBadge = ({ status }: ContestStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          label: 'Brouillon',
          variant: 'secondary' as const
        };
      case 'active':
        return {
          label: 'Actif',
          variant: 'success' as const
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
    <Badge variant={config.variant}>{config.label}</Badge>
  );
};

export default ContestStatusBadge;