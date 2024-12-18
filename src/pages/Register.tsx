import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, Share2, Bell, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
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
import { supabase } from "@/App";

const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  phoneNumber: z.string().optional(),
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      
      // Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) throw authError;

      if (authData.user) {
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

        if (profileError) throw profileError;

        toast({
          title: "Inscription réussie !",
          description: "Bienvenue sur notre plateforme de concours !",
        });

        navigate("/profile");
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Rejoignez notre communauté</h1>
          <p className="text-lg text-gray-600 mb-8">
            Participez à des concours passionnants et gagnez des prix exceptionnels !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Bell className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Notifications personnalisées</h3>
            <p className="text-gray-600">
              Recevez des alertes pour les nouveaux concours et ne manquez aucune opportunité.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Trophy className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tableau des scores</h3>
            <p className="text-gray-600">
              Suivez vos performances et comparez-les avec d'autres participants.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Share2 className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Partage social</h3>
            <p className="text-gray-600">
              Partagez vos victoires et invitez vos amis à participer.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <Camera className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Profil personnalisé</h3>
            <p className="text-gray-600">
              Ajoutez votre photo et personnalisez votre profil de participant.
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;