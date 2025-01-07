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

  const sendWelcomeEmail = async (email: string, firstName: string) => {
    return sendEmail(
      [email],
      "Bienvenue sur Passion Varadero !",
      `
        <h1>Bienvenue ${firstName} !</h1>
        <p>Nous sommes ravis de vous accueillir sur Passion Varadero.</p>
        <p>Participez à nos concours passionnants et gagnez des prix exceptionnels !</p>
        <br>
        <p>À bientôt,</p>
        <p>L'équipe Passion Varadero</p>
      `
    );
  };

  const sendParticipationConfirmation = async (email: string, contestTitle: string) => {
    return sendEmail(
      [email],
      `Participation confirmée - ${contestTitle}`,
      `
        <h1>Participation enregistrée !</h1>
        <p>Votre participation au concours "${contestTitle}" a bien été enregistrée.</p>
        <p>Nous vous tiendrons informé des résultats.</p>
        <br>
        <p>Bonne chance !</p>
        <p>L'équipe Passion Varadero</p>
      `
    );
  };

  const sendWinnerAnnouncement = async (email: string, contestTitle: string) => {
    return sendEmail(
      [email],
      `Félicitations ! Vous avez gagné - ${contestTitle}`,
      `
        <h1>Félicitations !</h1>
        <p>Vous avez gagné le concours "${contestTitle}" !</p>
        <p>Connectez-vous à votre compte pour réclamer votre prix.</p>
        <br>
        <p>L'équipe Passion Varadero</p>
      `
    );
  };

  const sendContestReminder = async (email: string, contestTitle: string, endDate: string) => {
    return sendEmail(
      [email],
      `Rappel - Le concours ${contestTitle} se termine bientôt !`,
      `
        <h1>Ne manquez pas votre chance !</h1>
        <p>Le concours "${contestTitle}" se termine le ${new Date(endDate).toLocaleDateString('fr-FR')}.</p>
        <p>Participez maintenant pour tenter de gagner !</p>
        <br>
        <p>À bientôt,</p>
        <p>L'équipe Passion Varadero</p>
      `
    );
  };

  return {
    sendWelcomeEmail,
    sendParticipationConfirmation,
    sendWinnerAnnouncement,
    sendContestReminder,
  };
};