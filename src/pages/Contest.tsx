import React from 'react';
import { useParams } from 'react-router-dom';
import QuestionnaireComponent from '@/components/QuestionnaireComponent';

const Contest = () => {
  const { contestId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Contest Details</h1>
      <p>Contest ID: {contestId}</p>
      <QuestionnaireComponent />
    </div>
  );
};

export default Contest;
