import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/App";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Veuillez entrer votre mot de passe"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if user is admin
          if (session.user.email === 'renaudcanuel@me.com') {
            navigate("/admin", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (state?.message && !isLoading) {
      toast({
        title: "Information",
        description: state.message,
      });
    }
  }, [state?.message, toast, isLoading]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        let errorMessage = "Email ou mot de passe incorrect.";
        
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez vérifier votre email pour activer votre compte.";
        }

        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: errorMessage,
        });
        return;
      }

      if (data?.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace membre !",
        });
        
        // Check if user is admin and redirect accordingly
        if (data.user.email === 'renaudcanuel@me.com') {
          navigate("/admin", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email requis",
        description: "Veuillez entrer votre email pour réinitialiser votre mot de passe.",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "Veuillez vérifier votre boîte de réception pour réinitialiser votre mot de passe.",
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Se connecter"
            )}
          </Button>

          <div className="flex justify-between text-sm">
            <Button
              type="button"
              variant="link"
              className="text-indigo-600"
              onClick={handleResetPassword}
              disabled={isSubmitting}
            >
              Mot de passe oublié ?
            </Button>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Créer un compte
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};