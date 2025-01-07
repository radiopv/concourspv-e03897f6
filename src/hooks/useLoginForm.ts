import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe"),
});

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    console.log("Début de la tentative de connexion");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log("Réponse de Supabase:", { data, error });
      return { data, error };
    } catch (error: any) {
      console.error("Erreur lors de la connexion:", error);
      return { data: null, error };
    }
  };

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email requis",
        description: "Veuillez entrer votre email pour réinitialiser votre mot de passe.",
      });
      return;
    }

    try {
      console.log("Tentative de réinitialisation du mot de passe pour:", email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return {
    form,
    handleLogin,
    handleResetPassword,
  };
};