
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UserRank from './UserRank';
import NextRankInfo from './NextRankInfo';
import UserActions from './UserActions';

interface UsersTableProps {
  users: any[];
  onResetPoints: (userId: string) => void;
  onAddParticipation: (userId: string) => void;
}

const UsersTable = ({ users, onResetPoints, onAddParticipation }: UsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Rang Actuel</TableHead>
            <TableHead>Prochain Rang</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={user.id}
              className={index < 3 ? 'bg-gradient-to-r from-amber-50 to-amber-100' : ''}
            >
              <TableCell className="font-medium">
                <UserRank position={index + 1} />
              </TableCell>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="font-bold text-indigo-600">
                {user.total_points}
              </TableCell>
              <TableCell>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-amber-200">
                  {user.user_points?.[0]?.current_rank || 'NOVATO'}
                </span>
              </TableCell>
              <TableCell>
                <NextRankInfo 
                  currentPoints={user.total_points}
                  currentRank={user.user_points?.[0]?.current_rank || 'NOVATO'}
                />
              </TableCell>
              <TableCell>
                <UserActions 
                  user={user} 
                  onResetPoints={onResetPoints} 
                  onAddParticipation={onAddParticipation}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
