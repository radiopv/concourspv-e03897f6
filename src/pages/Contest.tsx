import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionnaireComponent from '@/components/QuestionnaireComponent';

const Contest = () => {
  const { contestId } = useParams<{ contestId: string }>();

  if (!contestId) {
    return <div>ID du concours manquant</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuestionnaireComponent />
    </div>
  );
};

export default Contest;