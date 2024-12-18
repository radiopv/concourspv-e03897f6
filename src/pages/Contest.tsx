import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../App";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import QuestionnaireComponent from "@/components/QuestionnaireComponent";

interface Contest {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  participants: {
    count: number;
  }
}

const Contest = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"list" | "info" | "questions">("list");
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const { data: contests, isLoading, error } = useQuery({
    queryKey: ['contests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contests')
        .select('*, participants(count)')
        .eq('status', 'active');
      
      if (error) throw error;
      return data as Contest[];
    }
  });

  const handleContestSelect = (contestId: string) => {
    setSelectedContest(contestId);
    setStep("info");
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if user has already participated
      const { data: existingParticipant, error: fetchError } = await supabase
        .from('participants')
        .select()
        .eq('email', userInfo.email)
        .eq('contest_id', selectedContest)
        .single();

      if (fetchError && !fetchError.message.includes('Results contain 0 rows')) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      if (existingParticipant) {
        toast({
          title: "Participation impossible",
          description: "Vous avez déjà participé à ce concours.",
          variant: "destructive",
        });
        return;
      }

      // Create new participant
      const { error: insertError } = await supabase
        .from('participants')
        .insert([
          {
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            email: userInfo.email,
            contest_id: selectedContest,
            status: 'pending'
          }
        ]);

      if (insertError) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      setStep("questions");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Chargement des concours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-600">Une erreur est survenue lors du chargement des concours.</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2">Concours</h1>
        <p className="text-gray-600">
          Participez à nos concours et tentez de gagner des prix exceptionnels
        </p>
      </div>

      {step === "list" && (
        <div className="grid gap-6">
          {contests?.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{contest.title}</CardTitle>
                <CardDescription>{contest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      Du {new Date(contest.start_date).toLocaleDateString()} au{" "}
                      {new Date(contest.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contest.participants?.count || 0} participants
                    </p>
                  </div>
                  <Button onClick={() => handleContestSelect(contest.id)}>
                    Participer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step === "info" && (
        <form onSubmit={handleSubmitInfo} className="space-y-6 animate-fadeIn">
          <div className="glass-card p-8 rounded-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                required
                value={userInfo.firstName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, firstName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                required
                value={userInfo.lastName}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, lastName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full">
              Commencer le questionnaire
            </Button>
          </div>
        </form>
      )}

      {step === "questions" && selectedContest && (
        <div className="glass-card p-8 rounded-lg animate-fadeIn">
          <QuestionnaireComponent contestId={selectedContest} />
        </div>
      )}
    </div>
  );
};

export default Contest;