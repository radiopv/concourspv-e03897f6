import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface AdminAuthProps {
  onAuthenticated: () => void;
}

const AdminAuth = ({ onAuthenticated }: AdminAuthProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentative de connexion avec:", email);
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("Erreur de connexion:", signInError);
        throw signInError;
      }

      if (!signInData.session?.user) {
        throw new Error("Aucune session utilisateur trouvée");
      }

      console.log("Utilisateur connecté:", signInData.session.user.id);

      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('role')
        .eq('id', signInData.session.user.id)
        .single();

      console.log("Résultat de la vérification du rôle:", { member, memberError });

      if (memberError) {
        console.error("Erreur lors de la vérification du rôle:", memberError);
        throw memberError;
      }

      if (member.role !== 'admin') {
        console.error("L'utilisateur n'est pas admin:", member);
        throw new Error("Non autorisé : Accès administrateur requis");
      }

      console.log("Authentification admin réussie");
      onAuthenticated();
      
      toast({
        title: "Succès",
        description: "Authentification réussie en tant qu'administrateur",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'authentification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Administration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email administrateur"
              className="w-full"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Vérification..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;