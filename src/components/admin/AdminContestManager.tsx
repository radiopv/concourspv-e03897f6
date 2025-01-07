import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../App";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import ContestBasicForm from './ContestBasicForm';
import ContestPrizeManager from './ContestPrizeManager';
import EditQuestionsList from './EditQuestionsList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminContestManager = () => {
  const { contestId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const defaultFormData = {
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    draw_date: '',
    is_featured: false,
    is_new: false,
    has_big_prizes: false,
    shop_url: '',
    status: 'draft'
  };

  const [formData, setFormData] = useState(defaultFormData);

  const { data: contest, isLoading } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: async () => {
      if (!contestId) return null;
      
      const { data, error } = await supabase
        .from('contests')
        .select('*')
        .eq('id', contestId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!contestId
  });

  useEffect(() => {
    if (contest) {
      setFormData(contest);
    }
  }, [contest]);

  const contestMutation = useMutation({
    mutationFn: async (data: any) => {
      if (contestId) {
        const { error } = await supabase
          .from('contests')
          .update(data)
          .eq('id', contestId);
        
        if (error) throw error;
      } else {
        const { data: newContest, error } = await supabase
          .from('contests')
          .insert([data])
          .select()
          .single();
        
        if (error) throw error;
        return newContest;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-contests'] });
      toast({
        title: "Succès",
        description: contestId ? "Le concours a été mis à jour" : "Le concours a été créé",
      });
      if (!contestId && data) {
        navigate(`/admin/contests/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
      console.error('Error:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contestMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{contestId ? 'Modifier le concours' : 'Créer un nouveau concours'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informations</TabsTrigger>
              {contestId && (
                <>
                  <TabsTrigger value="prizes">Prix</TabsTrigger>
                  <TabsTrigger value="questions">Questions</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="basic">
              <form onSubmit={handleSubmit} className="space-y-4">
                <ContestBasicForm 
                  formData={formData}
                  setFormData={setFormData}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={contestMutation.isPending}
                >
                  {contestId ? 'Mettre à jour le concours' : 'Créer le concours'}
                </Button>
              </form>
            </TabsContent>

            {contestId && (
              <>
                <TabsContent value="prizes">
                  <ContestPrizeManager contestId={contestId} />
                </TabsContent>

                <TabsContent value="questions">
                  <EditQuestionsList contestId={contestId} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContestManager;