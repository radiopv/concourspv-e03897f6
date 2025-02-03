import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionnaireComponent from '@/components/QuestionnaireComponent';
import { useToast } from "@/hooks/use-toast";

const Contest = () => {
  const { contestId } = useParams<{ contestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!contestId) {
      console.error('Contest ID is missing from URL params');
      toast({
        title: "Erreur",
        description: "ID du concours manquant",
        variant: "destructive",
      });
      navigate('/contests');
      return;
    }
  }, [contestId, navigate, toast]);

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