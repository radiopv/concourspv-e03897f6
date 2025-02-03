import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionnaireComponent from '@/components/QuestionnaireComponent';

const Contest = () => {
  const { contestId } = useParams<{ contestId: string }>();
  
  console.log('Contest page - contestId:', contestId);

  if (!contestId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Erreur: ID du concours manquant</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionnaireComponent />
    </div>
  );
};

export default Contest;