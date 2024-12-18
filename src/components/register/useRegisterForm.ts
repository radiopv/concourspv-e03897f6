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
      // Première étape : vérifier si l'utilisateur existe déjà dans auth
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
        // L'utilisateur existe déjà, on vérifie s'il a confirmé son email
        const user = users[0];
        if (!user.email_confirmed_at) {
          toast({
            title: "Email non confirmé",
            description: "Votre compte existe déjà mais n'est pas confirmé. Veuillez vérifier votre boîte mail.",
            variant: "destructive",
          });
          return;
        }

        // Si l'email est confirmé, on propose de se connecter
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Vous allez être redirigé vers la page de connexion.",
        });
        
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              email: values.email,
              message: "Utilisez le formulaire ci-dessous pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
            }
          });
        }, 2000);
        return;
      }

      // Si l'utilisateur n'existe pas, on procède à l'inscription
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

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("Erreur lors de la création du compte");
      }

      // Création du profil dans la table members
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

      setTimeout(() => {
        navigate("/login", { 
          state: { 
            email: values.email,
            message: "Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter."
          }
        });
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