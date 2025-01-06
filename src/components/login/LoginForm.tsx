import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LoginFormFields } from "./LoginFormFields";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export const LoginForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { form, handleLogin, handleResetPassword } = useLoginForm();
  useAuthRedirect();

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      await handleLogin(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};