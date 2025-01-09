import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContestStats = () => {
  const { contestId } = useParams();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['contest-stats', contestId],
    queryFn: async () => {
      const { data: participants, error } = await supabase
        .from('participants')
        .select('score')
        .eq('contest_id', contestId)
        .not('score', 'is', null);

      if (error) throw error;

      // Initialize score ranges
      const scoreRanges = {
        '0-20': 0,
        '21-40': 0,
        '41-60': 0,
        '61-80': 0,
        '81-100': 0,
      };

      // Count participants in each score range
      participants?.forEach(participant => {
        const score = participant.score;
        if (score <= 20) scoreRanges['0-20']++;
        else if (score <= 40) scoreRanges['21-40']++;
        else if (score <= 60) scoreRanges['41-60']++;
        else if (score <= 80) scoreRanges['61-80']++;
        else scoreRanges['81-100']++;
      });

      return {
        scoreDistribution: scoreRanges,
        totalParticipants: participants?.length || 0,
        averageScore: participants?.reduce((acc, curr) => acc + (curr.score || 0), 0) / (participants?.length || 1),
      };
    },
  });

  const chartData = {
    labels: Object.keys(stats?.scoreDistribution || {}),
    datasets: [
      {
        label: 'Nombre de participants',
        data: Object.values(stats?.scoreDistribution || {}),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribution des scores',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  if (isLoading) {
    return <div>Chargement des statistiques...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques du concours</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total des participants</h3>
          <p className="text-3xl font-bold">{stats?.totalParticipants}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Score moyen</h3>
          <p className="text-3xl font-bold">{stats?.averageScore.toFixed(1)}%</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Participants qualifiés</h3>
          <p className="text-3xl font-bold">
            {Object.entries(stats?.scoreDistribution || {})
              .filter(([range]) => parseInt(range.split('-')[0]) >= 70)
              .reduce((acc, [_, count]) => acc + count, 0)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <Bar data={chartData} options={options} />
      </Card>
    </div>
  );
};

export default ContestStats;