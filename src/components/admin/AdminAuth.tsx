import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
      // Tentative de connexion
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      if (!session?.user) {
        throw new Error("Aucune session utilisateur trouvée");
      }

      console.log("Checking admin role for user:", session.user.id);

      // Vérification du rôle admin
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (memberError) {
        console.error("Error checking member role:", memberError);
        throw memberError;
      }

      if (!member) {
        console.log("Member not found, creating with admin role");
        const { error: createError } = await supabase
          .from('members')
          .insert([{
            id: session.user.id,
            email: session.user.email,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin'
          }]);

        if (createError) throw createError;
      } else if (member.role !== 'admin') {
        throw new Error("Non autorisé : Accès administrateur requis");
      }

      onAuthenticated();
      toast({
        title: "Succès",
        description: "Authentification réussie",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
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
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full"
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