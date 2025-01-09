import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const CreateTestContest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTestContest = async () => {
    try {
      // 1. Créer un nouveau concours
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Concours d'une semaine
      
      const { data: contest, error: contestError } = await supabase
        .from('contests')
        .insert([{
          title: `Concours Test ${new Date().toLocaleDateString()}`,
          description: "Concours de test avec 10 questions aléatoires",
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          draw_date: endDate.toISOString(),
          status: 'active',
          is_featured: false,
          is_new: true,
          has_big_prizes: false
        }])
        .select()
        .single();

      if (contestError) throw contestError;

      // 2. Récupérer 10 questions aléatoires de la banque
      const { data: questions, error: questionsError } = await supabase
        .from('question_bank')
        .select('*')
        .eq('status', 'available')
        .limit(10);

      if (questionsError) throw questionsError;

      if (!questions || questions.length < 10) {
        throw new Error("Pas assez de questions disponibles dans la banque");
      }

      // 3. Ajouter les questions au concours
      const questionsToInsert = questions.map((q, index) => ({
        contest_id: contest.id,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        article_url: q.article_url,
        order_number: index + 1,
        type: 'multiple_choice'
      }));

      const { error: insertError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (insertError) throw insertError;

      // 4. Rafraîchir les données
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['contests'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-contests'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-contests-with-counts'] })
      ]);

      toast({
        title: "Succès",
        description: "Concours de test créé avec 10 questions aléatoires",
      });
    } catch (error) {
      console.error('Error creating test contest:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création du concours de test",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={createTestContest}
      variant="outline"
      className="w-full"
    >
      Créer un concours de test (10 questions)
    </Button>
  );
};

export default CreateTestContest;
