import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const useRegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleRegister = async () => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Inscription réussie !",
      });

      return user;
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleRegister,
  };
};

export default useRegisterForm;
