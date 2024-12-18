import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../App";

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

const Contest = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<"info" | "questions">("info");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check if user has already participated
      const { data: existingParticipant, error: fetchError } = await supabase
        .from('participants')
        .select()
        .eq('email', userInfo.email)
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
            status: 'en_cours'
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-2">Concours</h1>
        <p className="text-gray-600">
          Participez à notre concours et tentez de gagner des prix exceptionnels
        </p>
      </div>

      {step === "info" ? (
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
      ) : (
        <div className="glass-card p-8 rounded-lg animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">Questionnaire</h2>
          <p className="text-gray-600">
            Cette partie sera implémentée dans la prochaine étape
          </p>
        </div>
      )}
    </div>
  );
};

export default Contest;