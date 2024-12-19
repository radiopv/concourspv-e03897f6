import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import ContestDetails from "@/components/contests/ContestDetails";
import ContestStats from "@/components/contests/ContestStats";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";
import Layout from "@/components/Layout";

const Contest = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: contest, isLoading, error } = useQuery({
    queryKey: ['contest', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="text-red-500">Error loading contest: {error.message}</div>
        </div>
      </Layout>
    );
  }

  if (!contest) {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Concours non trouvé</h2>
            <p className="text-gray-600 mt-2">Le concours que vous recherchez n'existe pas ou n'est plus disponible.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10 space-y-8">
        <h1 className="text-3xl font-bold mb-6">{contest.title}</h1>
        <ContestDetails contest={contest} />
        <QuestionnaireComponent contestId={contest.id} />
        <ContestStats contestId={contest.id} />
      </div>
    </Layout>
  );
};

export default Contest;