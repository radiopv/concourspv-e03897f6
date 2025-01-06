import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";
import { useNotifications } from "@/hooks/use-notifications";

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
  const { sendWelcomeEmail } = useNotifications();

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
      const { data: { user }, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Vous pouvez vous connecter directement ou utiliser la fonction 'Mot de passe oublié' si nécessaire.",
          });
          
          // Rediriger vers la page de connexion avec l'email pré-rempli
          navigate("/login", { 
            state: { 
              email: values.email,
              message: "Utilisez vos identifiants pour vous connecter ou cliquez sur 'Mot de passe oublié' si nécessaire."
            }
          });
          return;
        }
        throw error;
      }

      if (!user) {
        throw new Error("Erreur lors de la création du compte");
      }

      const { error: profileError } = await supabase
        .from('members')
        .insert([
          {
            id: user.id,
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

      // Send welcome email
      await sendWelcomeEmail(values.email, values.firstName);

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