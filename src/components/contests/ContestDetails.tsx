import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Trophy } from "lucide-react";

interface ContestDetailsProps {
  contest: {
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    draw_date?: string;
    is_featured: boolean;
    is_new: boolean;
    has_big_prizes: boolean;
  };
}

const ContestDetails = ({ contest }: ContestDetailsProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {contest.description && (
            <p className="text-gray-600">{contest.description}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Début</p>
                <p className="text-gray-600">
                  {new Date(contest.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Fin</p>
                <p className="text-gray-600">
                  {new Date(contest.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {contest.draw_date && (
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Tirage au sort</p>
                  <p className="text-gray-600">
                    {new Date(contest.draw_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContestDetails;