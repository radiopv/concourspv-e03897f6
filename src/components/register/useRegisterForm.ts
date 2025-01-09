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
      // 1. Check if user exists in auth system first
      const { data: { users }, error: authCheckError } = await supabase.auth.admin.listUsers({
        filters: {
          email: values.email
        }
      });

      if (authCheckError) {
        console.error("Erreur lors de la vérification de l'utilisateur:", authCheckError);
        throw authCheckError;
      }

      if (users && users.length > 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        });
        navigate("/login", { 
          state: { 
            email: values.email,
            message: "Utilisez vos identifiants pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
          }
        });
        return;
      }

      // 2. Check if email exists in members table
      const { data: existingMembers, error: memberCheckError } = await supabase
        .from('members')
        .select('email')
        .eq('email', values.email);

      if (memberCheckError) {
        console.error("Erreur lors de la vérification du membre:", memberCheckError);
        throw memberCheckError;
      }

      if (existingMembers && existingMembers.length > 0) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        });
        navigate("/login", { 
          state: { 
            email: values.email,
            message: "Utilisez vos identifiants pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
          }
        });
        return;
      }

      // 3. Create auth account
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
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Email déjà utilisé",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "destructive",
          });
          navigate("/login", { 
            state: { 
              email: values.email,
              message: "Utilisez vos identifiants pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
            }
          });
          return;
        }
        throw signUpError;
      }

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // 4. Create member profile
      const { error: profileError } = await supabase
        .from('members')
        .insert([
          {
            id: authData.user.id,
            first_name: values.firstName,
            last_name: values.lastName,
            email: values.email,
            phone_number: values.phoneNumber || null,
            total_points: 0,
            contests_participated: 0,
            contests_won: 0,
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

      navigate("/login", { 
        state: { 
          email: values.email,
          message: "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter."
        },
        replace: true
      });

    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      
      // Handle specific error cases
      if (error.message?.includes("User already registered")) {
        toast({
          variant: "destructive",
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        });
        navigate("/login", { 
          state: { 
            email: values.email,
            message: "Utilisez vos identifiants pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
          }
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    }
  };

  return {
    form,
    handleRegistration,
  };
};