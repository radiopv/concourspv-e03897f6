import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { NotificationPreferences } from "./NotificationPreferences";
import { SharingPreferences } from "./SharingPreferences";
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

export const RegisterForm = () => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        console.log("Auth Error:", authError); // Ajout d'un log pour déboguer
        
        if (authError.message.includes("already registered") || authError.message === "User already registered") {
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Cette adresse email est déjà utilisée. Veuillez vous connecter ou utiliser une autre adresse email.",
          });
          return;
        }
        throw authError;
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
        console.log("Profile Error:", profileError); // Ajout d'un log pour déboguer
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Jean" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jean.dupont@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+33 6 12 34 56 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProfilePhotoUpload />
        <NotificationPreferences />
        <SharingPreferences />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          S'inscrire
        </Button>
      </form>
    </Form>
  );
};