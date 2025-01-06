import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { motion } from "framer-motion";
import { AuthError } from "@supabase/supabase-js";

export const LoginForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, handleLogin, handleResetPassword } = useLoginForm();
  const { checkAndCreateProfile } = useAuthRedirect();

  const onSubmit = async (values: any) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await handleLogin(values);
      
      if (error) {
        let errorMessage = "Email ou mot de passe incorrect.";
        if (error instanceof AuthError) {
          switch (error.message) {
            case "Email not confirmed":
              errorMessage = "Veuillez vérifier votre email pour confirmer votre compte.";
              break;
            case "Invalid login credentials":
              errorMessage = "Identifiants invalides.";
              break;
            case "Invalid refresh token":
            case "refresh_token_not_found":
              errorMessage = "Session expirée. Veuillez vous reconnecter.";
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
        throw error;
      }
      
      if (data?.user) {
        await checkAndCreateProfile(data.user.id, data.user.email || '');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre espace membre !",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <LoginFormFields form={form} />

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
                onClick={() => handleResetPassword(form.getValues("email"))}
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
    </motion.div>
  );
};