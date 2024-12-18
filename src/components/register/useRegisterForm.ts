import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

const useRegisterForm = () => {
  const { toast } = useToast();
  const form = useForm<RegisterFormData>();

  const handleRegistration = async (data: RegisterFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Inscription réussie !",
      });
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
    form,
    handleRegistration,
  };
};

export default useRegisterForm;