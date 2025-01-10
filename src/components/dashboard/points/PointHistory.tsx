import React from 'react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryEntry {
  id: string;
  points: number;
  created_at: string;
  streak: number;
  contests?: {
    title: string;
  };
}

interface PointHistoryProps {
  history: HistoryEntry[];
}

const PointHistory = ({ history }: PointHistoryProps) => {
  if (!history.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">
                  {entry.points > 0 ? "+" : ""}{entry.points} points
                  {entry.contests?.title && ` - ${entry.contests.title}`}
                </p>
                <p className="text-sm text-gray-600">
                  {format(new Date(entry.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              </div>
              {entry.streak > 0 && (
                <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Série de {entry.streak}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointHistory;