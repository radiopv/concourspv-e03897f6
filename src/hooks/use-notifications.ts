import { supabase } from "@/App";
import { useToast } from "./use-toast";

export const useNotifications = () => {
  const { toast } = useToast();

  const sendEmail = async (to: string[], subject: string, html: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html },
      });

      if (error) throw error;

      toast({
        title: "Email envoyé",
        description: "La notification a été envoyée avec succès.",
      });

      return data;
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
      });
      throw error;
    }
  };

  const generateAIResponse = async (prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt },
      });

      if (error) throw error;

      return data.generatedText;
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer une réponse. Veuillez réessayer.",
      });
      throw error;
    }
  };

  return {
    sendEmail,
    generateAIResponse,
  };
};