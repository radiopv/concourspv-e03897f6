import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RanksList from "@/components/points/RanksList";
import CommunityStats from "@/components/points/CommunityStats";
import ExtraParticipations from "@/components/points/ExtraParticipations";

const Points = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Système de Points et Rangs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Rangs et Avantages</CardTitle>
          </CardHeader>
          <CardContent>
            <RanksList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques de la Communauté</CardTitle>
          </CardHeader>
          <CardContent>
            <CommunityStats />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participations Bonus</CardTitle>
        </CardHeader>
        <CardContent>
          <ExtraParticipations />
        </CardContent>
      </Card>
    </div>
  );
};

export default Points;