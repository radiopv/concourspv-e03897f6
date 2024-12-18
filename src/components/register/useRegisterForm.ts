import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phoneNumber: z.string().optional(),
});

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
  });

  const handleRegistration = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        console.error("Auth error details:", authError);
        
        // Try to parse the error body if it exists
        let errorBody;
        try {
          errorBody = JSON.parse(authError.message);
        } catch {
          errorBody = null;
        }

        // Check both the error message and parsed body for user exists error
        if (
          errorBody?.code === "user_already_exists" ||
          authError.message?.includes("already registered") ||
          authError.message?.includes("already exists")
        ) {
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse email.",
          });
          return;
        }

        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        });
        return;
      }

      if (!authData.user) {
        toast({
          variant: "destructive",
          title: "Erreur d'inscription",
          description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        });
        return;
      }

      const { error: profileError } = await supabase
        .from('members')
        .insert([
          {
            id: authData.user.id,
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone_number: values.phoneNumber || null,
            notifications_enabled: true,
            share_scores: true,
          }
        ]);

      if (profileError) {
        console.error("Erreur de création du profil:", profileError);
        throw profileError;
      }

      toast({
        title: "Inscription réussie !",
        description: "Bienvenue sur notre plateforme de concours !",
      });

      navigate("/contests");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    }
  };

  return {
    form,
    handleRegistration,
  };
};