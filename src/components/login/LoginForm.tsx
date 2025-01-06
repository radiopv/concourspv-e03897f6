import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { motion, AnimatePresence } from "framer-motion";

export const LoginForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { form, handleLogin, handleResetPassword } = useLoginForm();
  const { checkAndCreateProfile } = useAuthRedirect();

  useEffect(() => {
    // Simulate a minimum loading time to prevent flickering
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await handleLogin(values);
      if (error) {
        let errorMessage = "Email ou mot de passe incorrect.";
        if (error.message.includes("Email not confirmed")) {
          errorMessage = "Veuillez vérifier votre email pour confirmer votre compte.";
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
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
    </AnimatePresence>
  );
};