
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserEditDialog } from './UserEditDialog';

interface UserActionsProps {
  user: any;
  onResetPoints: (userId: string) => void;
  onAddParticipation: (userId: string) => void;
}

const UserActions = ({ user, onResetPoints, onAddParticipation }: UserActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <UserEditDialog user={user} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => onResetPoints(user.id)}
      >
        Réinitialiser
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddParticipation(user.id)}
      >
        +1 Participation
      </Button>
    </div>
  );
};

export default UserActions;
