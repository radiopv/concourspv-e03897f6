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
      // First, check if the user exists in the members table
      const { data: existingMembers, error: membersError } = await supabase
        .from('members')
        .select('id')
        .eq('email', values.email);

      if (membersError) {
        console.error("Erreur lors de la vérification du membre:", membersError);
        throw membersError;
      }

      if (existingMembers && existingMembers.length > 0) {
        toast({
          variant: "destructive",
          title: "Utilisateur existant",
          description: "Cet email est déjà enregistré. Veuillez vous connecter.",
        });
        navigate("/login");
        return;
      }

      // If not in members table, proceed with auth signup
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (signUpError) {
        // Handle specific error cases
        if (signUpError.message.includes("already registered")) {
          toast({
            variant: "destructive",
            title: "Utilisateur existant",
            description: "Cet email est déjà enregistré. Veuillez vous connecter.",
          });
          navigate("/login");
          return;
        }

        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Create the profile in members table
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

      // Redirect after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);

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