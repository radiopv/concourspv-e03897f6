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
      // Vérifier d'abord si l'utilisateur existe déjà
      const { data: existingUser, error: checkError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (existingUser?.user) {
        toast({
          variant: "destructive",
          title: "Utilisateur existant",
          description: "Cet email est déjà enregistré. Veuillez vous connecter avec votre mot de passe.",
        });
        navigate("/login");
        return;
      }

      // Si l'utilisateur n'existe pas, procéder à l'inscription
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error("Erreur d'authentification:", authError);

        if (authError.message?.includes("already registered") || 
            authError.message?.includes("already exists")) {
          toast({
            variant: "destructive",
            title: "Utilisateur existant",
            description: "Cet email est déjà enregistré. Veuillez vous connecter ou utiliser un autre email.",
          });
          navigate("/login");
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

      // Créer le profil utilisateur dans la table members
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
        description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
      });

      navigate("/login");
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