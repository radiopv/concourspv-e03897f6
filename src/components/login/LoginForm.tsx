import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { AuthError, AuthApiError } from '@supabase/supabase-js';

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const state = location.state as { email?: string; message?: string } | null;

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: state?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          await supabase.auth.signOut();
          return;
        }

        if (session?.user) {
          console.log("Session active trouvée, redirection vers dashboard");
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Information",
        description: state.message,
      });
    }
  }, [state?.message, toast]);

  const getErrorMessage = (error: AuthError) => {
    console.error("Erreur détaillée:", error);
    
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes('Email not confirmed')) {
            return "Veuillez vérifier votre email pour activer votre compte.";
          }
          if (error.message.includes('Invalid login credentials')) {
            return "Email ou mot de passe incorrect.";
          }
          if (error.message.includes('refresh_token_not_found')) {
            return "Session expirée. Veuillez vous reconnecter.";
          }
          return "Une erreur est survenue lors de la connexion.";
        case 422:
          return "Format d'email invalide.";
        case 429:
          return "Trop de tentatives de connexion. Veuillez réessayer plus tard.";
        default:
          return error.message;
      }
    }
    return "Une erreur inattendue est survenue. Veuillez réessayer.";
  };

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      console.log("Tentative de connexion pour:", values.email);
      
      // Nettoyer toute session existante d'abord
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Erreur de connexion:", error);
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: getErrorMessage(error),
        });
        return;
      }

      if (data?.user) {
        console.log("Connexion réussie pour:", data.user.email);
        
        // Définir la persistance de la session
        await supabase.auth.setSession({
          access_token: data.session?.access_token || '',
          refresh_token: data.session?.refresh_token || '',
        });

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace membre !",
        });
        
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {state?.message && (
        <Alert className="mb-6">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
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

        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-indigo-600 hover:underline">
              Mot de passe oublié ?
            </Link>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};