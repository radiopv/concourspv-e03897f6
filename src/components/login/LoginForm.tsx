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
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
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
          console.log("Active session found, redirecting to dashboard");
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

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      console.log("Attempting login for:", values.email);
      
      // Clear any existing session first
      await supabase.auth.signOut();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Login error:", error);
        let errorMessage = "Une erreur est survenue lors de la connexion";
        
        if (error instanceof AuthApiError) {
          switch (error.message) {
            case "Invalid login credentials":
              errorMessage = "Email ou mot de passe incorrect";
              break;
            case "Email not confirmed":
              errorMessage = "Veuillez confirmer votre email avant de vous connecter";
              break;
            default:
              errorMessage = error.message;
          }
        }
        
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        return;
      }

      if (data?.user) {
        console.log("Login successful for:", data.user.email);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace membre !",
        });
        
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion",
      });
    }
  };

  const handleResetPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer votre email pour réinitialiser votre mot de passe",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de l'email de réinitialisation",
      });
    } finally {
      setIsResetting(false);
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
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
          >
            Se connecter
          </Button>

          <div className="flex justify-between text-sm">
            <Link to="/register" className="text-indigo-600 hover:underline">
              Créer un compte
            </Link>
            <Button
              type="button"
              variant="link"
              className="text-indigo-600 hover:underline p-0 h-auto"
              onClick={handleResetPassword}
              disabled={isResetting}
            >
              {isResetting ? "Envoi en cours..." : "Mot de passe oublié ?"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};