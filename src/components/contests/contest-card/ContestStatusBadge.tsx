import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ContestStatusBadgeProps {
  status: string;
}

const ContestStatusBadge = ({ status }: ContestStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Actif',
          className: 'bg-green-100 text-green-800'
        };
      case 'draft':
        return {
          label: 'Brouillon',
          className: 'bg-gray-100 text-gray-800'
        };
      case 'archived':
        return {
          label: 'Archivé',
          className: 'bg-red-100 text-red-800'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant="secondary" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ContestStatusBadge;